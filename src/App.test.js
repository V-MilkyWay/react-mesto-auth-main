import { render, screen } from '@testing-library/react';
import App from './components/App.jsx';

test('renders learn react link', () => {
  render(<App />);
  //test2
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
