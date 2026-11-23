import { test } from 'node:test';
import assert from 'node:assert/strict';
import htmlToMarkdown from '../discord/htmlToMarkdown.ts';

test('converts Zoom invite HTML to plain lines with links intact', () => {
	const html = '<p>──────────<br/>DSA Richmond is inviting you to a scheduled Zoom meeting.<br/>Join Zoom Meeting<br/>https://us06web.zoom.us/j/873?pwd=abc.1<br/><br/>Meeting ID: 873 8977 7388<br/><br/><br/><br>──────────</p>';
	assert.equal(
		htmlToMarkdown(html),
		'──────────\nDSA Richmond is inviting you to a scheduled Zoom meeting.\nJoin Zoom Meeting\nhttps://us06web.zoom.us/j/873?pwd=abc.1\n\nMeeting ID: 873 8977 7388\n\n──────────',
	);
});

test('keeps formatting, links and decodes entities', () => {
	assert.equal(
		htmlToMarkdown('<b>Bold</b> &amp; <i>it</i><br><a href="https://x.com/?a=1&amp;b=2">Sign up</a> <a href="https://y.com">https://y.com</a><ul><li>one</li><li>two</li></ul>'),
		'**Bold** & *it*\n[Sign up](https://x.com/?a=1&b=2) https://y.com\n- one\n- two',
	);
});

test('leaves plain text untouched', () => {
	const text = 'Bring snacks\n\n\nprice < $5 & fun > boring';
	assert.equal(htmlToMarkdown(text), text);
});
