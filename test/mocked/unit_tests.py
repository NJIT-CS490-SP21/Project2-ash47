'''
    get_tracks_test.py
    
    This file tests get artist track fuction to check if function returns
    expected URL when passing input list.
    In this test we mock the random choice function so it always return the first
    value on the aritist list.
'''

import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app_functions import *
sys.path.append(os.path.abspath('../../'))
from models import *

INPUT = "input_artist_ids"
EXPECTED_OUTPUT = "expected"

class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                INPUT:  {'winner': 'Aman', 'losser': 'Joe'},
                EXPECTED_OUTPUT: [101, 100, 99]
            },
        ]
        initial_person = Person(username='Aman', score='100', rank=1)
        second_person = Person(username='Joe', score='100', rank=1)
        third_person = Person(username='Jack', score='100', rank=1)
        self.initial_db_mock = [initial_person, second_person, third_person]
        
    def mocked_query_filter(self, name):
        return Person.query.filter_by(username=data["winner"]).first()
            
    def mocked_commit(self):
        pass

    def test_update_score(self):
        for test in self.success_test_params:
            with patch('app_functions.Person.query.filter_by', self.mocked_query_filter):
                with patch('app_functions.DB.session.commit', self.mocked_commit):
                    actual_result = update_winner_score(test[INPUT])
                    expected_result = test[EXPECTED_OUTPUT]
                    
                    self.assertEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()