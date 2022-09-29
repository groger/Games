import { render, screen } from '@testing-library/react';
import Wordle from './Wordle';

describe('Wordle component', () => {
   it('should render the Wordle component', () => {
      render(<Wordle />);
       expect(true).toBeTruthy();
   });

   it('should render the input', () => {
       render(<Wordle />);
       expect(screen.getByTestId('wordle-input')).toBeInTheDocument();
   });
});
