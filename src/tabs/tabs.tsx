import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import './tabs.css';
import { Link } from 'react-router-dom';

function Tabs() {
	return (
		<>
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
					<input id='urlField' value='' />
					<div className='somethingElse'>Summarize something else</div>

					<button id='generateButton'>
						<div
							id='spinDiv'
							className='spinner'
							style={{ display: 'none' }}
						></div>
						<div style={{ display: 'inline-block' }}>Generate Summary</div>
					</button>
					<div id='responseContainer'></div>
				</div>
			</div>
			<div className='test mt-20'>
				<ul>
					<p>Just keep this for nav ref later on</p>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/about'>About</Link>
					</li>
				</ul>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/about' element={<About />} />
				</Routes>
			</div>
		</>
	);
}

export default Tabs;
