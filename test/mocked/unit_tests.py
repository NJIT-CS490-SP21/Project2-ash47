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
                INPUT:  'Joe',
                EXPECTED_OUTPUT: ['Aman', 'Joe']
            },
        ]
        initial_person = Person(username='Aman', score='100', rank=1)
        self.initial_db_mock = [initial_person]
        
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
            
    def mocked_db_session_commit(self):
        pass
    
    def mocked_person_query_all(self):
        return self.initial_db_mock

    def test_add_new_user(self):
        for test in self.success_test_params:
            with patch('app_functions.DB.session.add', self.mocked_db_session_add):
                with patch('app_functions.DB.session.commit', self.mocked_db_session_commit):
                    with patch('models.Person.query') as mocked_query:
                        mocked_query.all = self.mocked_person_query_all
                        actual_result = add_new_user(test[INPUT])
                        expected_result = test[EXPECTED_OUTPUT]
                        
                        self.assertEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()