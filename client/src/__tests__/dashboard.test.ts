import '@testing-library/jest-dom';

import {
  render,
  fireEvent,
  getByText,
  getByTestId,
} from '@testing-library/svelte';

import Comment__SvelteComponent_ from '../dashboard/Comment.svelte';
import DashboardView from '../dashboard/DashboardView.svelte';
import Draft from '../dashboard/Draft.svelte';
import { formatDate } from '../utils/utils';

test('Comment render', () => {
  const date = new Date('1995-12-17T03:24:00');
  const comment: IComment = {
    id: 123415,
    url: 'google.com',
    text: 'Hallo Welt!',
    signature: "",
    author: {
      id: 42,
      name: 'Albert Einstein'
    },
    date: date,
  };
  const { container } = render(Comment__SvelteComponent_, { comment: comment });
  expect(container).toContainElement(getByText(container, comment.text));
  //expect(container).toContainElement(getByText(container, comment.author));
  expect(container).toContainElement(
    getByText(container, formatDate(comment.date))
  );
});

test('Draft render', () => {
  const date = new Date('1995-12-17T03:24:00');
  const draft: IDraft = {
    id: 12345,
    url: 'google.com',
    text: 'good',
    date: date,
  };
  const { container } = render(Draft, { draft: draft });
  expect(container).toContainElement(getByText(container, draft.text));
  expect(container).toContainHTML(formatDate(draft.date));
});
