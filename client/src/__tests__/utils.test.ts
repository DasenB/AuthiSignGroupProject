import '@testing-library/jest-dom';

import { render } from '@testing-library/svelte';

import VerificationStatusIcon from '../utils/VerificationStatusIcon.svelte';
import { deserializeDate, deserializeDraft, deserializeComment } from '../utils/utils';

test('verified status', () => {
    const { container } = render(VerificationStatusIcon, { status: 'done' });

    const verifiedStatus = container.getElementsByClassName('verified');

    expect(verifiedStatus[0]).toHaveTextContent('done');
});

test('unknown status', () => {
    const { container } = render(VerificationStatusIcon, { status: 'question_mark' });

    const unknownStatus = container.getElementsByClassName('unknown');

    expect(unknownStatus[0]).toHaveTextContent('question_mark');
});

test('rejected status', () => {
    const { container } = render(VerificationStatusIcon, { status: 'close' });

    const rejectedStatus = container.getElementsByClassName('rejected');

    expect(rejectedStatus[0]).toHaveTextContent('close');
});

//not sure how to test or if it's even necessary
// test('loading status', () => {
// });

test('deserializeDate', () => {
    const string = '1995-12-17T03:24:00';
    const date = new Date(string);
    //ms since 1970
    const number = 819167040000;
    expect(deserializeDate(string)).toBeInstanceOf(Date);
    expect(deserializeDate(date)).toBeInstanceOf(Date);
    expect(deserializeDate(number)).toBeInstanceOf(Date);
});

//test is not really necessary as the IDraft Interface only accepts dates?
test('deserializeDraft', () => {
    const date = new Date('1995-12-17T03:24:00');
    const draft: IDraft = {
        id: 12345,
        url: 'www.google.com',
        text: 'test draft',
        date: date,
    };
    deserializeDraft(draft);
    expect(draft.date).toBeInstanceOf(Date);
});

//test is not really necessary as the IComment Interface only accepts dates?
test('deserializeComment', () => {
    const date = new Date('1995-12-17T03:24:00');
    const comment: IComment = {
        id: 123415,
        url: 'google.com',
        text: 'Hallo Welt!',
        signature: 'empty',
        author: {
            id: 1,
            name: 'Albert Einstein'
        },
        date: date,
    };
    deserializeComment(comment);
    expect(comment.date).toBeInstanceOf(Date);
});
//TODO: focusing on unit testing
// test('getCurrentTab', () => {
// });

//TODO: still hardcoded
// test('getCurrentUserOrcid', () => {
// });