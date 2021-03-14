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
from app import remove_user

INPUT = "input_artist_ids"
EXPECTED_OUTPUT = "expected"

class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                INPUT:  'Aman',
                EXPECTED_OUTPUT: 'https://api.spotify.com/v1/artists/0Y5tJX1MQlPlqiwlOH1tJY/top-tracks'
            },
            {
                INPUT: None,
                EXPECTED_OUTPUT: None
            }
        ]
        
    def mocked_random_choice(self, artist_id):
        return artist_id[0]

    def test_add_user(self):
        for test in self.success_test_params:
            # TODO: Mock random.choice to always return the 0 index
            
            with patch('get_tracks.random.choice', self.mocked_random_choice):
                pass
            
                # TODO: Make a call to add user with your test inputs
                # then assign it to a variable
                actual_result = get_artist_url(test[INPUT])
                
                # Assign the expected output as a variable from test
                expected_result = test[EXPECTED_OUTPUT]
    
                # Use assert checks to see compare values of the results
                self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()