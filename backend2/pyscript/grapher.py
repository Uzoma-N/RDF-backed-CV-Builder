"""
Author: Uzoma Nwiwu
Date: 2025-11-05
Description: This module contains the graphData class which retrieves and 
    organizes data from an RDF database.
"""

from rdflib import Graph, Literal, RDF, URIRef
from rdflib.namespace import FOAF, XSD
from pyscript.rdfquery import rdfQueries as asker
from typing import List, Dict, Any, Optional
from datetime import datetime

class graphData:
    """ this class retrieves information from the database"""

    def __init__(self, selectedName):
        self.graphDB = Graph()
        self.name_list = []
        self.name = ""
        self.selectedName = selectedName
        self.nameURI = ""

        # --- 1. Define the RDF Data ---
        self.graphDB.parse("backend2/database/resume.ttl", format="turtle")  # Use "turtle" if it's a .ttl file
        self.get_Persons()


    def aggregate_by_keys(self, data: List[Dict[str, Any]], group_keys: List[str]) -> List[Dict[str, Any]]:
        """
        Groups a list of dictionaries by multiple specified keys and consolidates 
        the values of all other keys into unique lists.

        Args:
            data: The input list of dictionaries.
            group_keys: A list of keys used to group the dictionaries (e.g., ['label', 'country']).

        Returns:
            A list of aggregated dictionaries with consolidated values as lists.
        """
        aggregated_data = {}

        for item in data:
            # 1. Create a unique, immutable key (a tuple) from the values of the group_keys
            group_id = tuple(item[key] for key in group_keys)

            if group_id not in aggregated_data:
                # If this is the first time seeing this group combination, initialize
                
                # The initial structure includes the group_keys and sets up unique sets for others
                aggregated_data[group_id] = {}
                
                # Copy the grouping keys and values into the result dict
                for key in group_keys:
                    aggregated_data[group_id][key] = item[key]
                
                # Initialize all other keys as sets for automatic uniqueness checking
                for k, v in item.items():
                    if k not in group_keys:
                        aggregated_data[group_id][k] = {v}
            else:
                # If the group combination is already present, consolidate the remaining keys
                current_group = aggregated_data[group_id]
                for k, v in item.items():
                    if k not in group_keys:
                        # Use .add() on the set to ensure uniqueness
                        current_group[k].add(v)

        # 2. Convert the aggregated dictionary (containing sets) back into the desired list format
        final_list = []
        for group_id, group_dict in aggregated_data.items():
            result_item = {key: group_dict[key] for key in group_keys} # Start with group keys
            
            # Convert the sets back into sorted lists for the final output
            for k, v_set in group_dict.items():
                if k not in group_keys:
                    result_item[k] = list(v_set) 
            
            final_list.append(result_item)
            
        return final_list

    def get_Persons(self):
        """
        retrieves all the persons present in the database

        
        Returns:
            A list of persons available in database.
        """
        results = self.graphDB.query("".join([asker.get_prefix(), asker.get_person_query()]))
        
        for row in results:
            # Extract category name from the full URI
            self.name_list.append(str(row.person_name))

    def get_name(self):
        """
        selects the name of the person to be shown in the front end

        
        Returns:
            a string containing the user to be shoen on the frontend.
        """
        for entry in self.name_list:
            if entry == self.selectedName:
                self.name = entry


    def get_personDetails(self):
        """
        gets the details for the abouts page of this person selected

        
        Returns:
            a list of one dictionary.
        """
        
        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_person_detail_query()]).format(person_name=self.name))
        Detail = []        
        for row in details:
            Detail.append({
               'personURI':  str(row.personURI),
               'dob':  self.format_date_string(str(row.dob), 'day_month_year') if row.dob else '',
               'address':  str(row.address),
               'emailAddress':  str(row.emailAddress) if row.emailAddress else '',
               'phoneNumber':  str(row.phoneNumber) if row.phoneNumber else '',
               'roleTitle' : str(row.roleTitle),
               'aboutMe' : str(row.aboutMe) if row.aboutMe else '',
               'photo' : str(row.photo) if row.photo else ''
            })
        
        self.nameURI = Detail[0]['personURI']
        return Detail


    def get_workExperience(self):
        """
        returns a list of dictionaries containing all wprk experiences by the selected Name

        Returns:
            a list of dictionaries.
        """
        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_experience_query()]).format(person=self.nameURI))
        WorkExperience = []
        for row in details:
            WorkExperience.append({
                'main': str(row.experience),
                'workTitle': str(row.workTitle),
                'industryName': str(row.industryName),
                'city': self.process_uri_fragment(str(row.city)),
                'country': self.process_uri_fragment(str(row.country)),
                'startDate': self.format_date_string(str(row.startDate), 'year'),
                'endDate': self.format_date_string(str(row.endDate), 'year') if row.endDate else 'Present',
                'dutyDescription': str(row.dutyDescription),
                'category': self.process_uri_fragment(str(row.category)) if row.category else ''
                })
        
        jsonWorkExperience = self.aggregate_by_keys(WorkExperience, ['main'])            
        return jsonWorkExperience
    

    def get_Education(self):
        """
        returns a list of dictionaries containing all education by the selected Name

        Returns:
            a list of dictionaries.
        """    
        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_education_query()]).format(person=self.nameURI))
        Education = []
        for row in details:
            Education.append({
                'main': str(row.education),
                'schoolName': str(row.schoolName),
                'degreeTitle': str(row.degreeTitle),
                'city': self.process_uri_fragment(str(row.city)),
                'country': self.process_uri_fragment(str(row.country)),
                'grade': str(row.grade) if row.grade else '',
                'endDate': self.format_date_string(str(row.endDate), 'month_year') if row.endDate else 'Present',
                'startDate': self.format_date_string(str(row.startDate), 'month_year'),
                'gradeVal': str(row.gradeVal) if row.gradeVal else ''
                })
        
        jsonEducation = self.aggregate_by_keys(Education, ['main'])
        return jsonEducation
    

    def get_skill(self):
        """
        returns a list of dictionaries containing all skills by the selected Name
        Returns:
            a list of dictionaries.
        """
        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_skill_query()]).format(person=self.nameURI))
        Skill = []
        for row in details:
            Skill.append({
                'main': str(row.skill),
                'skillTitle': str(row.skillTitle),
                'category': self.process_uri_fragment(str(row.category)) if row.category else '',
                'typename': str(row.typename),
                'percentageScore': str(row.percentageScore),
                'percentage': str(row.percentage),
                'skillDescription': str(row.skillDescription) if row.skillDescription else ''        
        })
            
        jsonSkill = self.aggregate_by_keys(Skill, ['main'])            
        return jsonSkill
    
    def get_skill_types(self):
        """
        returns a list of dictionaries containing all skill types by the selected Name
        
        Returns:
            a list of dictionaries.
        """

        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_skill_type()]).format(person=self.nameURI))
        SkillType = []
        for row in details:
            SkillType.append({
                'main': str(row.skillLabel)                
        
        })
        
        jsonSkillType = self.aggregate_by_keys(SkillType, ['main'])
        return jsonSkillType
    

    def get_certifications(self):
        """
        returns a list of dictionaries containing all certifications gotten by the selected Name
        
        Returns:
            a list of dictionaries.
        """

        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_achievement_query()]).format(person=self.nameURI))
        Certificate = []
        for row in details:
            Certificate.append({
                'main': str(row.achievement),
                'certTitle': str(row.certTitle),
                'endDate': self.format_date_string(str(row.endDate), 'month_year') if row.endDate else '',
                'link': str(row.link) if row.link else '',                
                'category': self.process_uri_fragment(str(row.category)) if row.category else ''
        
        })
            
        jsonCertificate = self.aggregate_by_keys(Certificate, ['main'])
        return jsonCertificate
    

    def get_projects(self):
        """
        returns a list of dictionaries containing all projects by the selected Name

        Returns:
            a list of dictionaries.
        """

        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_project_query()]).format(person=self.nameURI))
        Project = []
        for row in details:
            Project.append({
                'main': str(row.project),
                'projectTitle': str(row.projectTitle),
                'projectClass': str(row.projectClass) if row.projectClass else '',
                'projectDescription': str(row.projectDescription) if row.projectDescription else '',
                'projectLink': str(row.projectLink) if row.projectLink else '#',                 
                'category': self.process_uri_fragment(str(row.category)) if row.category else ''
        
        })
            
        jsonProject = self.aggregate_by_keys(Project, ['main'])
        return jsonProject
    

    def get_project_class(self):
        """
        returns a list of dictionaries containing all project classes done by the selected Name
        
        Returns:
            a list of dictionaries.
        """

        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_project_class_query()]).format(person=self.nameURI))
        ProjectClass = []
        for row in details:
            ProjectClass.append({
                'main': str(row.projectClass)                
        
        })
        
        jsonProjectClass = self.aggregate_by_keys(ProjectClass, ['main'])
        return jsonProjectClass
    

    def get_services(self):
        """
        returns a list of dictionaries containing all services provided by the selected Name

        Returns:
            a list of dictionaries.
        """

        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_service_query()]).format(person=self.nameURI))
        Services = []
        for row in details:
            Services.append({
                'main': str(row.service),
                'serviceTitle': str(row.serviceTitle),
                'serviceText': str(row.serviceText) if row.serviceText else '',
                'serviceImage': str(row.serviceImage) if row.serviceImage else ''                      
        })
            
        jsonServices = self.aggregate_by_keys(Services, ['main'])
        return jsonServices
    

    def get_socials(self):
        """
        returns a list of dictionaries containing all social media accounts by the selected Name

        Returns:
            a list of dictionaries.
        """

        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_social_query()]).format(person=self.nameURI))
        Social = []
        for row in details:
            Social.append({
                'main': str(row.social),
                'socialType': self.process_uri_fragment(str(row.socialType)),
                'socialLink': str(row.socialLink)
                                       
        })
            
        jsonSocial = self.aggregate_by_keys(Social, ['main'])
        return jsonSocial
    
    def get_categories(self):
        """
        returns a list of dictionaries containing all social media accounts by the selected Name

        Returns:
            a list of dictionaries.
        """

        details = self.graphDB.query("".join([asker.get_prefix(), asker.get_category_query()]).format(person=self.nameURI))
        Category = []
        for row in details:
            Category.append({
                'main': self.process_uri_fragment(str(row.category))                
                                       
        })
            
        jsonCategory = self.aggregate_by_keys(Category, ['main'])
        return jsonCategory
    

    def process_uri_fragment(self, value: Any) -> str:
        """
        Strips the full URI to only the last segment after the final slash ('/') 
        unless the value appears to be a full, live link (contains '://').

        Args:
            value: The input value, typically a string or a URI object.

        Returns:
            The full link, or the stripped fragment, as a string.
        """
        # 1. Convert the input value to a string if it's not already
        s = str(value)
                
        # 3. If it's not a full link, check for the presence of a slash.
        if "URN://cv.resume/" in s:
            # Split the string by the last occurrence of '/' and return the part after it.
            
            return s.split('/')[-1]
        
        # 4. If no '/' is found and it's not a full link, return the original string.
        return s
    

    def format_date_string(self, date_string: Optional[str], format_type: str = 'month_year') -> str:
        """
        Converts a date string (e.g., "YYYY-MM-DDT...") into a specific human-readable format.

        Args:
            date_string: The date string to convert (e.g., "2025-09-15T00:00:00").
                        Can be None, in which case an empty string is returned.
            format_type: The desired output format. 
                        Options: 'day_month_year' (e.g., "15 September, 2025") 
                                'month_year' (e.g., "September, 2025") 
                                'year' (e.g., "2025").

        Returns:
            The formatted date string, or an empty string if input is None/empty.
        """
        if not date_string:
            return ""
        
        # Clean the string to only include the date part (YYYY-MM-DD)
        date_part = date_string.split('T')[0]

        # 1. Parse the date string into a datetime object
        try:
            dt_object = datetime.strptime(date_part, '%Y-%m-%d')
        except ValueError:
            return "Invalid Date Format"

        # 2. Format the datetime object based on the requested type
        if format_type == 'day_month_year':
            # %d = Day of the month as a zero-padded decimal number
            # %B = Full month name
            # %Y = Full year
            return dt_object.strftime('%d %B, %Y')
        
        elif format_type == 'month_year':
            # %B = Full month name
            return dt_object.strftime('%B, %Y')
        
        elif format_type == 'year':
            return dt_object.strftime('%Y')
            
        else:
            raise ValueError("Invalid format_type. Use 'day_month_year', 'month_year', or 'year'.")
        


