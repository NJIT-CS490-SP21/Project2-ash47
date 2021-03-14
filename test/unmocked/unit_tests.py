import unittest
import os
import sys

# This lets you import from the parent directory (one level up)
sys.path.append(os.path.abspath('../../'))
from app_functions import *

BOARD_INPUT = "board"
TURN_INPUT = 'turn'
DATA_INPUT = 'data'
EXPECTED_OUTPUT = "expected"

class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params_update_board = [
            {
                BOARD_INPUT: [None, None, None, None, None, None, None, None, None],
                TURN_INPUT: ['X'],
                DATA_INPUT: {'move': 1, 'turn': 'X'},
                EXPECTED_OUTPUT: (
                    [None, 'X', None, None, None, None, None, None, None],
                    ['O']
                )
            },
            {
                BOARD_INPUT: ['X', 'X', None, None, None, None, 'O', None, None],
                TURN_INPUT: ['X'],
                DATA_INPUT: {'move': 8, 'turn': 'O'},
                EXPECTED_OUTPUT: (
                    ['X', 'X', None, None, None, None, 'O', None, 'O'],
                    ['X']
                )
            },
            {
                BOARD_INPUT: ['X', 'X', None, None, None, None, 'O', None, None],
                TURN_INPUT: ['X'],
                DATA_INPUT: { 'reset': 'EmptyList' },
                EXPECTED_OUTPUT: (
                    [None, None, None, None, None, None, None, None, None],
                    ['X']
                )
            }
            # TODO add another test case
        ]
        self.success_test_params_reset = [
            {
                BOARD_INPUT: ['X', 'X', 'X', None, None, None, 'O', 'O', None],
                TURN_INPUT: ['O'],
                EXPECTED_OUTPUT: (
                    [None, None, None, None, None, None, None, None, None],
                    ['X']
                )
            },
            {
                BOARD_INPUT: [None, None, None, None, None, None, None, None, None],
                TURN_INPUT: ['X'],
                EXPECTED_OUTPUT: (
                    [None, None, None, None, None, None, None, None, None],
                    ['X']
                )
            },
            {
                BOARD_INPUT: ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'],
                TURN_INPUT: ['X'],
                EXPECTED_OUTPUT: (
                    [None, None, None, None, None, None, None, None, None],
                    ['X']
                )
            }
        ]
        self.success_test_params_swap_turn = [
            {
                TURN_INPUT: 'X',
                EXPECTED_OUTPUT: 'O'
            },
            {
                TURN_INPUT: 'O',
                EXPECTED_OUTPUT: 'X'
            },
            {
                TURN_INPUT: 'Y',
                EXPECTED_OUTPUT: None
            }
        ]

    def test_update_board(self):
        """ This test checks the update board function on app functions file side """
        for test in self.success_test_params_update_board:
            actual_result = update_board(test['board'], test['turn'], test['data'])

            expected_result = test["expected"]

            self.assertEqual(actual_result[0], expected_result[0])
            self.assertEqual(actual_result[1], expected_result[1])
            self.assertEqual(actual_result, expected_result)

    def test_reset(self):
        """ This test checks the herlper function reset for update board """
        for test in self.success_test_params_reset:
            actual_result = reset(test['board'], test['turn'])
            
            expected_result = test["expected"]
            
            self.assertEqual(actual_result[0], expected_result[0])
            self.assertEqual(actual_result[1], expected_result[1])
            self.assertEqual(actual_result, expected_result)
            
    def test_swap_turn(self):
        """ This test checks the herlper function swap turn for update board """
        for test in self.success_test_params_swap_turn:
            actual_result = swap_turn(test['turn'])
            
            expected_result = test["expected"]
            
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(type(actual_result), type(expected_result))


if __name__ == '__main__':
    unittest.main()