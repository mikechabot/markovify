import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import sass from './scss/style.scss';
import Main from './components/main';

// Needed for onTouchTap
// Can go away with react 1.0 release
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
    <Main />,
	document.getElementById('markovify')
);