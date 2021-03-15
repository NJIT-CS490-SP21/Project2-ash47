import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Board only appear after login', () => {
  
  const result = render(<App />);
  
  // 1. Check if input element exists
  const inputNode = screen.getByPlaceholderText('User name....');
  expect(inputNode).toBeInTheDocument();
  
  
  // 2. Check if submit button exists
  const submitButton = screen.getByText('Submit');
  expect(submitButton).toBeInTheDocument();
  
  // 3. Click the submit button
  fireEvent.click(submitButton);
  
  // 4. Check if error message shows up if no input
  const boardElement = screen.getByText('Please enter a valid username');
  expect(boardElement).toBeInTheDocument();
  
  // 5. Get the input element and add test value
  const inputBox = result.getByPlaceholderText('User name....');
  fireEvent.change(inputBox, {target: {value: 'test'}});
  
  
  // 6. get the submit button and click
  const loginButton = screen.getByText('Submit');
  expect(loginButton).toBeInTheDocument();
  fireEvent.click(loginButton);
  
  // 7. Check if 'Welcome to tic tac toe' message appears (As its in board element)
  const user = screen.getByText('Welcome to tic tac toe, test');
  expect(user).toBeInTheDocument();
});

test('Leaderboard appear after button is clicked', () => {
  const result = render(<App />);
  
  // 1. login to access board
  const inputBox = result.getByPlaceholderText('User name....');
  fireEvent.change(inputBox, {target: {value: 'test'}});
  
  const loginButton = screen.getByText('Submit');
  fireEvent.click(loginButton);
  
  screen.getByText('Welcome to tic tac toe, test');
  
  // 2. get show leaderboard button
  
  const showLeaderBoard = screen.getByText('Show Leaderboard');
  fireEvent.click(showLeaderBoard);
  
  // 3. check if 'Leaderboard' appear (It's in login )
  const leaderBoardBox = screen.getByText('Leaderboard');
  expect(leaderBoardBox).toBeInTheDocument();
  
  // 4. get and click on hide leaderboard button
  const hideLeaderBoard = screen.getByText('Hide Leaderboard');
  fireEvent.click(hideLeaderBoard);
  
  // 5. Check if 'Leaderboard' is not on screen
  expect(leaderBoardBox).not.toBeInTheDocument();
  
});

test('Check if box is filled when a box is clicked', () => {
  const result = render(<App />);
  // 1. login to access board
  const inputBox = result.getByPlaceholderText('User name....');
  fireEvent.change(inputBox, {target: {value: 'test'}});
  
  const loginButton = screen.getByText('Submit');
  fireEvent.click(loginButton);
  
  screen.getByText('Welcome to tic tac toe, test');
  
  // 2. Add chat message is input box
  const chatInputBox = result.getByPlaceholderText('Type message...');
  expect(chatInputBox).toBeInTheDocument();
  
  fireEvent.change(chatInputBox, {target: {value: 'test message 1'}});
  
  // 3. Click on submit button
  const sendbutton = screen.getByText('Submit');
  expect(sendbutton).toBeInTheDocument();
  fireEvent.click(sendbutton);
  
  // 4. Check if message appears on screen
  const userMessage = screen.getByText('test: test message 1');
  expect(userMessage).toBeInTheDocument();
});

test('Check if logout button hides the game board', () => {
  const result = render(<App />);
  // 1. login to access board
  const inputBox = result.getByPlaceholderText('User name....');
  fireEvent.change(inputBox, {target: {value: 'test'}});
  
  const loginButton = screen.getByText('Submit');
  fireEvent.click(loginButton);
  
  screen.getByText('Welcome to tic tac toe, test');
  
  // Get and click on logout button
  const LogoutButton = screen.getByText('Logout');
  expect(LogoutButton).toBeInTheDocument();
  fireEvent.click(LogoutButton);
  
  // Check ig 'Welcome to my app..!!' exists (Message is only on login screen)
  const loginScreen = screen.getByText('Welcome to my app..!!');
  expect(loginScreen).toBeInTheDocument();
});
