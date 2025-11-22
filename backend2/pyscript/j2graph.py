"""
Author: Uzoma Nwiwu
Date: 2025-11-05
Description: This module contains functions to convert a JSON representation 
    of a CV/resume into RDF triples using rdflib.
    The JSON structure is expected to have sections like personal info, 
    professional profile, work experience, education
"""

from rdflib import Graph, Literal, URIRef, BNode, Namespace
from rdflib.namespace import FOAF, RDF, XSD
import uuid

# --- Define Namespaces ---
CUSTOM = Namespace("URN://cv.resume/") # A custom namespace for CV specific properties
RDFS = Namespace("http://www.w3.org/2000/01/rdf-schema#")
DC = Namespace("http://purl.org/dc/elements/1.1/")

def generate_uri(base_name):
    """Generates a unique, deterministic URI based on a base name."""
    # Using UUID for uniqueness, or a hash of the content for stable URIs in a real app
    unique_id = uuid.uuid4()
    return CUSTOM[f"{base_name}_{unique_id}"]

def convert_personal_info(graph: Graph, data: dict) -> URIRef:
    """Converts the 'personal' section into triples, creating the main Person resource."""
    # Create the main subject URI for the CV holder (the Person)
    person_uri = generate_uri("Person")
    
    # Declare the type of the main subject
    graph.add((person_uri, RDF.type, FOAF.Person))
     
    # change here when entry for photo is available
    graph.add((person_uri, FOAF.status, Literal("assets/avatar-1.png", lang="en")))

    # Basic fields
    if data.get('fullName'):
        graph.add((person_uri, RDFS.label, Literal(data['fullName'], lang="en")))

    if data.get('function'):
        graph.add((person_uri, FOAF.title, Literal(data['function'], lang="en")))
    
    if data.get('email'):
        graph.add((person_uri, CUSTOM.hasEmail, Literal(data['email'])))

    if data.get('phone'):
        graph.add((person_uri, CUSTOM.hasPhone, Literal(data['phone'])))

    if data.get('location'):
        graph.add((person_uri, CUSTOM.hasAddress, Literal(data['location'])))

    if data.get('aboutMe'):
        graph.add((person_uri, DC.description, Literal(data['aboutMe'], lang="en")))

    return person_uri

def convert_professional_profile(graph: Graph, person_uri: URIRef, professional_profile_list: list):
    """Converts the 'professionalProfile' entries."""

    for entry in professional_profile_list:
        # Create a URI for the profile entry/expertise block
        profile_uri = generate_uri("Expertise")
        
        # Link the person to this expertise
        graph.add((person_uri, CUSTOM.provideService, profile_uri))
        
        # Define the resource type (e.g., a specific skill area or profile entry)
        graph.add((profile_uri, RDF.type, CUSTOM.Service))
        
        if entry.get('title'):
            graph.add((profile_uri, FOAF.title, Literal(entry['title'])))
            
        if entry.get('description'):
            graph.add((profile_uri, DC.description, Literal(entry['description'], lang="en")))

def convert_work_experience(graph: Graph, person_uri: URIRef, work_experience_list: list):
    """Converts the 'workExperience' list into JobPosting/Employment triples."""

    for job in work_experience_list:
        # Create a URI for the employment resource
        employment_uri = generate_uri("Employment")
        
        # Link the person to this employment history item
        graph.add((person_uri, CUSTOM.hasExperience, employment_uri))
        
        # Define the resource type
        graph.add((employment_uri, RDF.type, CUSTOM.WorkExperience))
        
        if job.get('title'):
            graph.add((employment_uri, FOAF.title, Literal(job['title'])))
            
        if job.get('company'):
            # Create a BNode or URIRef for the company (Organization)
            company_uri = generate_uri("Company")
            city_uri = generate_uri("City")
            graph.add((employment_uri, CUSTOM.doneAt, company_uri))
            graph.add((company_uri, RDF.type, FOAF.Organization))
            graph.add((company_uri, FOAF.title, Literal(job['company'])))
            graph.add((company_uri, CUSTOM.locatedIn, city_uri))
            graph.add((city_uri, RDF.type, CUSTOM.City))
            graph.add((city_uri, CUSTOM.locatedIn, Literal(job['country'])))
            graph.add((city_uri, RDFS.label, Literal(job['city'])))
            
        if job.get('duty'):
            # Create a BNode or URIRef for the duty (responsibilities)
            duty_uri = generate_uri("Duty")
            graph.add((employment_uri, CUSTOM.hasDuty, duty_uri))
            graph.add((duty_uri, RDF.type, CUSTOM.Duties))            
            graph.add((duty_uri, FOAF.title, Literal(job['duty'], lang="en")))
            
        # Time and Location
        if job.get('startDate'):
            graph.add((employment_uri, CUSTOM.startDate, Literal(job['startDate'])))
        if job.get('endDate'):
            graph.add((employment_uri, CUSTOM.endDate, Literal(job['endDate'])))


def convert_education(graph: Graph, person_uri: URIRef, education_list: list):
    """Converts the 'education' list into Educational triples."""
    for edu in education_list:
        # Create a URI for the educational entry
        credential_uri = generate_uri("Education")
        
        # Link the person to this credential
        graph.add((person_uri, CUSTOM.hasEducation, credential_uri))
        
        # Define the resource type
        graph.add((credential_uri, RDF.type, CUSTOM.Education))

        if edu.get('degree'):
            course_uri = generate_uri("Course")
            degree_uri = generate_uri("Degree")
            graph.add((credential_uri, CUSTOM.hasCourse, course_uri))
            graph.add((course_uri, CUSTOM.degreeLevel, degree_uri))
            graph.add((degree_uri, FOAF.title, Literal(edu['degree'])))

        if edu.get('institution'):
            # Create a BNode for the institution (Organization)
            institution_uri = generate_uri("Institute")
            city_uri = generate_uri("City")
            graph.add((credential_uri, CUSTOM.doneAt, institution_uri))
            graph.add((institution_uri, RDF.type, FOAF.Organization))
            graph.add((institution_uri, FOAF.title, Literal(edu['institution'])))
            graph.add((institution_uri, CUSTOM.locatedIn, city_uri))
            graph.add((city_uri, RDF.type, CUSTOM.City))
            graph.add((city_uri, CUSTOM.locatedIn, Literal(edu['country'])))
            graph.add((city_uri, RDFS.label, Literal(edu['city'])))

        # Time
        if edu.get('startDate'):
            graph.add((credential_uri, CUSTOM.startDate, Literal(edu['startDate'])))
        if edu.get('endDate'):
            graph.add((credential_uri, CUSTOM.endDate, Literal(edu['endDate'])))


def convert_skill(graph: Graph, person_uri: URIRef, skill_list: list):
    """Converts the 'skill' list into Skill triples."""
    for skill in skill_list:
        # Create a URI for the educational entry
        skill_uri = generate_uri("Skill")
        
        # Link the person to this credential
        graph.add((person_uri, CUSTOM.hasSkill, skill_uri))
        
        # Define the resource type
        skillType_uri = generate_uri("SkillType")
        graph.add((skill_uri, RDF.type, skillType_uri))
        graph.add((skillType_uri, RDFS.subClassOf, CUSTOM.Skill))
        graph.add((skillType_uri, RDFS.label, Literal(skill['type'])))


        if skill.get('title'):
            graph.add((skill_uri, FOAF.title, Literal(skill['title'])))
        
        if skill.get('description'):
            graph.add((skill_uri, DC.description, Literal(skill['description'], lang="en")))

        if skill.get('status'):
            graph.add((skill_uri, FOAF.status, Literal(skill['status'])))

        

def convert_project(graph: Graph, person_uri: URIRef, project_list: list):
    """Converts the 'project' list into project triples."""
    for proj in project_list:
        # Create a URI for the educational entry
        project_uri = generate_uri("Project")
        
        # Link the person to this credential
        graph.add((person_uri, CUSTOM.hasProject, project_uri))
        
        # Define the resource type
        graph.add((project_uri, RDF.type, FOAF.Project))

        if proj.get('title'):
            graph.add((project_uri, FOAF.title, Literal(proj['title'])))
        
        if proj.get('type'):
            type_uri = generate_uri("ProjectType")
            graph.add((project_uri, FOAF.theme, type_uri))
            graph.add((type_uri, RDFS.label, Literal(proj['type'])))

        if proj.get('description'):
            graph.add((project_uri, DC.description, Literal(proj['description'], lang="en")))


def convert_json_to_triples(json_data: dict, graph: Graph):
    """
    Main function to process the entire JSON structure and populate the RDF graph.
    """
    if not json_data:
        print("Error: Input JSON data is empty.")
        return

    # 1. Convert Personal Info (sets up the main subject)
    person_uri = convert_personal_info(graph, json_data.get('personal', {}))

    # 2. Convert Professional Profile
    convert_professional_profile(graph, person_uri, json_data.get('professionalProfile', []))
    
    # 3. Convert Work Experience
    convert_work_experience(graph, person_uri, json_data.get('workExperience', []))

    # 4. Convert Education
    convert_education(graph, person_uri, json_data.get('education', []))

    # 5. Convert Work Experience
    convert_skill(graph, person_uri, json_data.get('skill', []))

    # 6. Convert Education
    convert_project(graph, person_uri, json_data.get('project', []))

    # NOTE: Projects and Skills conversion can be added here following the same pattern
    
    print(f"Successfully converted {len(json_data)} sections to {len(graph)} triples.")

    return graph
