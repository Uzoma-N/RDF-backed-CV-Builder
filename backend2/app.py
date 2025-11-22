# -*- coding: utf-8 -*-
__author__ = 'Nwiwu Uzoma'

from flask import Flask, render_template, jsonify, request
from pyscript.grapher import graphData
from rdflib import Graph
from pyscript.j2graph import convert_json_to_triples
import json

app = Flask(__name__)

# --- Flask Route ---
@app.route('/', methods=['GET', 'POST'])
def index():
    """
        Calls all the query results and organize them in as nested dictionary in json format

        Args:
            all the query results

        Returns:
            a json readable nested dictionary.
        """
    
    if request.method == 'POST':
        # 1. Read the JSON body sent from the JavaScript fetch request
        data = request.get_json()

        # 2. Extract the data you need (profile_uri)
        profileUser = data.get('profile_user')
        
        if not profileUser:
            # Handle missing data error
            return jsonify({'error': 'Missing profile URI in request'}), 400
        
        # initialize the knowledge graph with a profile user
        basicUser = profileUser
        jsonReqData = getDictionary(basicUser)

        return jsonify(jsonReqData)
    
    else: # request.method == 'GET' (Initial page load)
        
        basicUser = 'Lname Fname'
        jsonIniData = getDictionary(basicUser)

        return render_template('index.html', json_data=jsonIniData)
    
# --- Flask Route ---
@app.route('/record', methods=['POST'])
def graphUpdater():
    """
        Calls all the query results and organize them in as nested dictionary in json format

        Args:
            all the query results

        Returns:
            a json readable nested dictionary.
        """
    # 1. Read the JSON body sent from the JavaScript fetch request
    userData = request.get_json()

    # 2. Extract the data you need (profile_uri)
    oldGraphPath = "database/resume.ttl"
    newGraph  = process_cv_data(userData)

    verdict = merge_and_save(oldGraphPath, newGraph)

    if verdict == "Yes":
        response = {
            'status': 'success',
            'message': f'Graph merged successfully: {verdict}. Please refresh the page to see updates.'
        }
    elif verdict == "No":
        response = {
                'status': 'failure',
                'message': f'Graph merged successfully: {verdict}. Please try again later.'
            }

    return jsonify(response)        


def getDictionary(UserData):
    """
    Initializes the RDF graph, extract various sections, and organizes them into a nested dictionary.

    Args:
        UserData (str): The profile user identifier.
    Returns:
        dict: A nested dictionary containing various sections of the user's data.
    """
    # initialize the knowledge graph
    graf = graphData(UserData)         
    graf.get_name()  #get the first and last name of user. use this to get the personURI

        # initialize data container
    jsonData = {}
        
    jsonData["NameList"] = graf.name_list
    jsonData["Name"] = graf.name
    jsonData["Details"] = graf.get_personDetails()
    jsonData["Category"] = graf.get_categories()
    jsonData["Education"] = graf.get_Education()
    jsonData["WorkExperience"] = graf.get_workExperience()
    jsonData["Skills"] = graf.get_skill()
    jsonData["Certificate"] = graf.get_certifications()
    jsonData["SkillType"] = graf.get_skill_types()
    jsonData["Project"] = graf.get_projects()
    jsonData["ProjectClass"] = graf.get_project_class()
    jsonData["Service"] = graf.get_services()
    jsonData["Social"] = graf.get_socials()

    return jsonData

def process_cv_data(data: dict):
    """
    Initializes the RDF graph, adds namespaces, converts the data, and saves the output.
    
    In a real application, 'data' would be the JSON payload received from the request body.
    """
    print("--- Starting RDF Triples Conversion ---")

    # 1. Initialize the RDF Graph
    g = Graph()

    # 2. Bind Namespaces for cleaner output (Turtle format)
    g.bind("foaf", "http://xmlns.com/foaf/0.1/")
    g.bind("rdfs", "http://www.w3.org/2000/01/rdf-schema#")
    g.bind("dc", "http://purl.org/dc/elements/1.1/")
    g.bind("", "URN://cv.resume/")

    # 3. Call the conversion function
    final_graph = convert_json_to_triples(data, g)

    # 4. Serialize the resulting graph in Turtle format (.ttl)
    turtle_output = final_graph.serialize(format='turtle')
    
    return turtle_output


def merge_and_save(original_filepath: str, new_graph_lines: Graph):
    """
    Loads an RDF graph from the original file, merges a second graph 
    from a new data file into it, and saves the combined graph back 
    to the original file path.
    """
    
    # 1. Load the original graph from its file path
    try:
        original_graph = Graph()
        original_graph.parse(original_filepath, format="turtle") # format=None allows rdflib to auto-detect
        print(f"Original graph loaded: {len(original_graph)} triples.")
    except Exception as e:
        print(f"Error loading original graph '{original_filepath}': {e}")
        return
    
    try:
        new_graph = Graph()
        new_graph.parse(data=new_graph_lines, format="turtle")
        print(f"New graph loaded: {len(new_graph)} triples.")
    except Exception as e:
        print(f"Error loading new graph: {e}")
        return

    # CRITICAL CHECK: Ensure both objects are Graphs before merging
    if not isinstance(original_graph, Graph) or not isinstance(new_graph, Graph):
        raise TypeError("Attempted to merge non-Graph object. Original or New graph failed to initialize.")
    
    
    # 2. Merge the new data into the original graph
    original_triple_count = len(original_graph)
    original_graph += new_graph

    new_triple_count = len(original_graph)
    triples_added = new_triple_count - original_triple_count

    print(f"Merging complete. Added {triples_added} new triples.")
    print(f"Combined graph size: {new_triple_count} triples.")


    # 3. Save the combined graph back to the original file path
    save_format = 'turtle' 

    try:
        original_graph.serialize(destination=original_filepath, format=save_format)
        print(f"Successfully saved combined graph back to '{original_filepath}' in {save_format} format.")
        print(f"--- Merge Process Finished ---")
        return "Yes"
    except Exception as e:
        print(f"Error saving graph: {e}")
        return "No"


if __name__ == '__main__':
    # Run: python app.py
    print("Running Flask app. Access http://127.0.0.1:5000/")
    app.run(debug=True)