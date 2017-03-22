var MarkdownField = function($field){
	// only initialize once
	if($field.data('markdown')) return;

	function throttle(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		var last,
				deferTimer;
		return function() {
			var context = scope || this,
					now = +new Date,
					args = arguments;
			if (last && now < last + threshhold) {
				clearTimeout(deferTimer);
				deferTimer = setTimeout(function() {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				last = now;
				fn.apply(context, args);
			}
		};
	};

	// Fix overflow bug in Panel
	var mainEditors = $('.main .codemirror');
	var modalEditors = $('.modal .codemirror');

	function fixCodemirrorOverflow(){
		mainEditors.css('width', $('.main .form').width());
		modalEditors.css('width', $('.modal .form').width());
	}

	fixCodemirrorOverflow();
	window.addEventListener('resize', throttle(fixCodemirrorOverflow, 100));

	// Initialize Codemirror
	var textarea = $field.get(0);
	var codemirror = textarea.parentNode.querySelector('.codemirror');
	var readOnly = codemirror.classList.contains('codemirror-is-readonly');
	var disabled = codemirror.classList.contains('codemirror-is-disabled');
	var hasCounter = textarea.parentNode.parentNode.querySelector('.field-counter');

	var options = {};
	options.value = textarea.value;
	options.viewportMargin = Infinity;
	options.lineWrapping = true;
	options.dragDrop = false;
	options.tabSize = 4;
	options.indentWithTabs = false;
	options.extraKeys = { 'Enter': 'newlineAndIndentContinueMarkdownList' };
	options.mode = {
		name: 'kirbytext',
		highlightFormatting: true
	};

	// Add placeholder
	if (textarea.hasAttribute('placeholder')) {
		options.placeholder = textarea.getAttribute('placeholder');
	}

	if(readOnly || disabled) {
		options.readOnly = true;
		options.cursorHeight = 0;
	}

	var editor = CodeMirror(codemirror, options);

	if (!readOnly && !disabled) {
		editor.on('change', function() {
			textarea.value = editor.getValue();

			// Enable minLength and maxLength validation
			if (hasCounter) $(textarea).trigger('keyup');
		})

		editor.on('focus', function(){
			codemirror.classList.add('codemirror-focus');
		});

		editor.on('blur', function(){
			codemirror.classList.remove('codemirror-focus');
		});

		// Enable drag & drop
		$(codemirror).droppable({
			hoverClass: 'codemirror-over',
			accept: $('.sidebar').find('.draggable'),
			drop: function (event, element) {
				var doc = editor.getDoc(),
						cursor = doc.getCursor();

				doc.replaceRange(element.draggable.data('text'), {
					line: cursor.line,
					ch: cursor.ch
				});
			}
		});
	}

	$field.data('markdown', true);
};

(function($) {
	$.fn.markdown = function() {
		return new MarkdownField(this);
	};
})(jQuery);
