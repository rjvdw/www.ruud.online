'use strict'

const fs = require('fs/promises')
const path = require('path')
const sass = require('sass')

const attrs = require('./splatToHtmlAttrs')
const { INPUT_DIR, OUTPUT_DIR } = require('./constants')
const FsWatcher = require('./FsWatcher')

const CSS_IN_DIR = path.join(__dirname, '..', INPUT_DIR)
const CSS_OUT_DIR = path.join(__dirname, '..', OUTPUT_DIR)

const SASS_OPTIONS = {
	loadPaths: [CSS_IN_DIR],
	style: 'compressed',
}

const compile = (file) =>
	sass.compile(file, {
		...SASS_OPTIONS,
	}).css

const compileString = (data, syntax) =>
	sass.compileString(data, {
		...SASS_OPTIONS,
		syntax: syntax === 'sass' ? 'indented' : syntax,
	}).css

exports.stylesheet = (text, options) => {
	const {
		source,
		critical,
		async: loadAsync,
		syntax,
		// eslint-disable-next-line no-unused-vars
		filename: _filename,
		...rest
	} = options
	if (source) {
		if (critical) {
			return renderCritical(source, rest)
		} else {
			return renderImport(source, loadAsync, rest)
		}
	} else {
		return renderInline(text, syntax || 'sass', rest)
	}
}

async function compileAllStylesheets() {
	const root = path.join(CSS_IN_DIR, 'css')
	const stack = [root]

	while (stack.length) {
		const item = stack.pop()
		const stat = await fs.lstat(item)

		if (stat.isDirectory()) {
			for (const file of await fs.readdir(item)) {
				stack.push(path.join(item, file))
			}
		} else {
			await compileStylesheet(item)
		}
	}
}

exports.compileAllStylesheets = compileAllStylesheets

async function compileStylesheet(file) {
	if (!isStylesheet(file) || path.basename(file).startsWith('_')) {
		return
	}

	const friendlyName = file.replace(CSS_IN_DIR, '').replace(/^\/*/, '')
	const target = file
		.replace(CSS_IN_DIR, CSS_OUT_DIR)
		.replace(/\.s[ca]ss$/, '.css')

	try {
		await ensureOutDirExists(target)
		if ((await fs.lstat(file)).isFile()) {
			await fs.writeFile(target, compile(file))
			console.log(`[stylesheet watcher] compiled "${friendlyName}"`)
		}
	} catch (err) {
		if (err.code === 'ENOENT') {
			// File doesn't exist (anymore)
			console.warn(`[stylesheet watcher] file "${friendlyName}" is gone`)
		} else {
			console.error(
				`[stylesheet watcher] Failed to process "${friendlyName}":`,
				err,
			)
		}
	}
}

exports.stylesheetWatcher = new FsWatcher(
	path.join(CSS_IN_DIR, 'css'),
	async () => {
		await compileAllStylesheets()
	},
)

function renderImport(file, loadAsync, rest) {
	const href = file.replace(/\.s[ac]ss$/, '.css')
	if (loadAsync && process.env.CSS_MODE === 'production') {
		return `
			<link rel="preload" as="style" href="/${href}" ${attrs(rest)}>
			<noscript><link rel="stylesheet" href="/${href}" ${attrs(rest)}></noscript>
		`
	} else {
		return `<link rel="stylesheet" href="/${href}" ${attrs(rest)}>`
	}
}

function renderCritical(file, rest) {
	if (process.env.CSS_MODE === 'production') {
		const inPath = path.join(CSS_IN_DIR, file)
		return `<style${attrs(rest)}>${compile(inPath)}</style>`
	} else {
		return renderImport(file, false, rest)
	}
}

function renderInline(data, syntax, rest) {
	return `<style${attrs(rest)}>${compileString(data, syntax)}</style>`
}

async function ensureOutDirExists(outPath) {
	try {
		await fs.mkdir(path.dirname(outPath), { recursive: true })
	} catch (err) {
		if (err.code === 'EEXIST') {
			// already exists -- noop
		} else {
			throw err
		}
	}
}

function isStylesheet(filename) {
	return (
		filename.endsWith('.sass') ||
		filename.endsWith('.scss') ||
		filename.endsWith('.css')
	)
}
