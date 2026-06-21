import { render } from '@testing-library/react';
import { About } from './about.component';

describe('About component', () => {
  it('should render the title and content', () => {
    const { getByText } = render(<About />);

    expect(
      getByText((content) => {
        return content.includes(
          'Star Trek Explorer is a comprehensive search application'
        );
      })
    ).toBeInTheDocument();
    expect(getByText('About Star Trek Explorer')).toBeInTheDocument();
    expect(getByText('Our Application')).toBeInTheDocument();
  });
});
