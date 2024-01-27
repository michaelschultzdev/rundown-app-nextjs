import React, { useState, useEffect } from 'react';
import JSDOM from 'jsdom';
import Readability from '../assets/Readability.js';
import './popup.css';

const Popup = () => {
	const [activeTabUrl, setActiveTabUrl] = useState('');
	const [pageContents, setPageContents] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [parsedContent, setParsedContent] = useState('');

	useEffect(() => {
		// Fetch active tab URL
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const activeTab = tabs[0];
			setActiveTabUrl(activeTab.url);
			// console.log(activeTabUrl);
		});
	}, [activeTabUrl]);

	useEffect(() => {
		// const parser = new DOMParser();
		// const dom = parser.parseFromString(pageContents, 'text/html');
		// console.log(dom);
		// const article = new Readability(dom).parse();
		// console.log(article);
		// const holderClone = document.getElementById('holder').cloneNode(true);
		// document
		// 	.getElementById('toText')
		// 	.addEventListener(
		// 		'click',
		// 		() =>
		// 			(document.getElementById(
		// 				'holder'
		// 			).innerHTML = `<pre>${article.textContent}</pre>`)
		// 	);
	}, [pageContents]);

	const handleGenerateButtonClick = async () => {
		setLoading(true);

		try {
			// Fetch page contents
			console.log(activeTabUrl);
			const content = await scrapePageContent(activeTabUrl);
			// setPageContents(content as string);

			const parser = new DOMParser();
			const waitForContent = await content;
			const dom = parser.parseFromString(waitForContent as string, 'text/html');

			const article = new Readability(dom).parse();

			const apiKey = process.env.OPENAI_API_KEY;
			const apiUrl = 'https://api.openai.com/v1/chat/completions';

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					messages: [
						{
							role: 'system',
							content:
								'You are a summary model, you will take content and summarize it into at least 3 spaced out sentences.',
						},
						{
							role: 'user',
							content: `Summarize this content in a few spaced out sentences, use an introductory paragraph and an ordered list: ${article.textContent}`,
						},
					],
				}),
			});

			const data = await response.json();
			const summary = data.choices[0].message.content;

			setPageContents(summary);

			setErrorMessage('');

			console.log(data);
		} catch (e) {
			console.error(e);
			setErrorMessage(
				'Could not read the page for an unknown reason, try again later or try a different URL.'
			);
		} finally {
			setLoading(false);
		}
	};

	const scrapePageContent = (url) => {
		return new Promise((resolve) => {
			if (!url) {
				console.error('No active tab URL found.');
				resolve('');
			} else {
				fetch(url)
					.then((response) => response.text())
					.then((data) => {
						// console.log('Content fetched successfully:', data);
						resolve(data);
					})
					.catch((error) => {
						console.error('Error fetching content:', error);
						resolve('');
					});
			}
		});
	};

	return (
		<div className='popup-container'>
			<div className='topbar'>
				<div className='flex'>
					<img
						src='/images/icons/icon128.png'
						width='20'
						height='20'
						alt='Rundown - Summarize and organize websites, recipes, and articles.'
					/>
				</div>
				<div className='flex font-custom'>
					<span>RUNDOWN</span>
				</div>
				<div className='flex opacs'>RD</div>
			</div>
			<div className='maincontent'>
				<div className='titleContainer'>Page you're summarizing:</div>
				<input id='urlField' className='mb-2' value={activeTabUrl} readOnly />
				{/* <div className='somethingElse'>Summarize something else</div> */}

				<button id='generateButton' onClick={handleGenerateButtonClick}>
					<div
						id='spinDiv'
						className='spinner'
						style={{ display: 'none' }}
					></div>
					<div style={{ display: 'inline-block' }}>Generate Summary</div>
				</button>
				<div id='responseContainer'>
					{loading ? 'Loading...' : pageContents}
				</div>
				<div className='error-massage'>
					{errorMessage && <div>{errorMessage}</div>}
				</div>
			</div>
		</div>
	);
};

export default Popup;
