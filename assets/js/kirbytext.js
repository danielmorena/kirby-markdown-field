CodeMirror.defineMode('kirbytext', function (config, parserConfig) {
	var kirbytextOverlay = {
		start: [
			// (tag: at beginning of line
			{
				regex: /\([a-z0-9]+:\s/i,
				sol: true,
				token: 'kirbytext',
				next: 'attribute'
			},
			// (tag: not at beginning and before whitespace
			{
				regex: /\s\([a-z0-9]+:\s/i,
				token: 'kirbytext',
				next: 'attribute'
			}
		],
		attribute: [
			// attribute: inside (tag: and with exactly one space
			{
				regex: /[a-z0-9]+:\s(?!\s)/i,
				token: 'kirbytext',
				next: 'attribute'
			},
			// ) inside (tag:
			{
				regex: /\)/,
				token: 'kirbytext',
				next: 'start'
			}
		]
	};

	parserConfig.name = 'markdown';

	return CodeMirror.overlayMode(
		CodeMirror.getMode(config, parserConfig),
		CodeMirror.simpleMode(config, kirbytextOverlay)
	);
});