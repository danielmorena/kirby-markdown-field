CodeMirror.defineMode('kirbytext', function (config, parserConfig) {
	var kirbytextOverlay = {
		start: [
			// ( at beginning of line
			{
				regex: /\((?=[a-z0-9]+:\s)/i,
				sol: true,
				token: 'kirbytext',
				next: 'attribute'
			},
			// ( after a space
			{
				regex: /\s\((?=[a-z0-9]+:\s)/i,
				token: 'kirbytext',
				next: 'attribute'
			}
		],
		attribute: [
			// attribute:
			{
				regex: /[a-z0-9]+:\s/i,
				token: 'kirbytext',
				next: 'value'
			},
			// )
			{
				regex: /\)/,
				token: 'kirbytext',
				next: 'start'
			}
		],
		value: [
			// value before attribute:
			{
				regex: /[^\)]+?\s(?=(?:[a-z0-9]+:\s(?!\s)))/i,
				token: 'default',
				next: 'attribute'
			}, 
			// value before )
			{
				regex: /[^\)]+?(?=\))/i,
				token: 'default',
				next: 'attribute'
			}
		]
	};

	parserConfig.name = 'markdown';

	return CodeMirror.overlayMode(
		CodeMirror.getMode(config, parserConfig),
		CodeMirror.simpleMode(config, kirbytextOverlay)
	);
});