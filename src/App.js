import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const markdownSampleInput = `
# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)

`


function App() {
	const [markdownInput, setMarkdownInput] = useState(markdownSampleInput);
	const [markdownOutput, setMarkdownOutput] = useState({__html: marked.parse(markdownInput)});
	const [isLandscape, setIsLandscape] = useState(true);
	const [direction, setDirection] = useState('landscape');

	const handleMarkdownEntryChange = (event) => {
		setMarkdownInput(
			event.target.value
		);
	};

	const cursorPosRef = useRef(null);
	const handleTabDown = (event) => {
		console.log(event.target);
		if (event.keyCode === 9) {
			event.preventDefault();

			const { selectionStart, selectionEnd, value } = event.target;

			const newValue =
				value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);

			setMarkdownInput(newValue);

			// store correct cursorPos
			cursorPosRef.current = selectionStart + 1;

			// wait until after rerender,
			// then set cursorPos
			setTimeout(() => {
				event.target.setSelectionRange(cursorPosRef.current, cursorPosRef.current)
			}, 0);
		}
	}

	useEffect(() => {
		setMarkdownOutput({
			// parse the input before cleaning to fix '<' and '>' issues (rendering as &gt;)
			__html: DOMPurify.sanitize(marked.parse(markdownInput))
		});
	}, [markdownInput]);

	const switchLayout = () => {
		setIsLandscape(() => isLandscape ? false : true);
	}

	useEffect(() => {
		if (isLandscape) {
			setDirection('landscape');
		} else {
			setDirection('portrait');
		}
	}, [isLandscape]);

	// need to parse \n => <br /> via regex
	

  return (
		<div className="App">
			<header>
				<h1>Markdown Previewer</h1>
				<button 
					onClick={switchLayout} 
					value={isLandscape}>
						view {isLandscape ? 'portrait' : 'landscape'}
				</button>
			</header>
			<div className={`container ${direction}`}>
				<div className='column'>
					<textarea id='editor' value={markdownInput} onChange={handleMarkdownEntryChange} onKeyDown={handleTabDown}/>
				</div>
				<div className='column'>
					<div className='markdownContainer'>
						<div id='preview' dangerouslySetInnerHTML={markdownOutput}></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
