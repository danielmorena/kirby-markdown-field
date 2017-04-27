var MarkdownField = function($field){
	// only initialize once
	if($field.data('markdown')) return;

	var textarea = $field.get(0);
	var codemirror = textarea.parentNode.querySelector('.codemirror');
	var readOnly = codemirror.classList.contains('codemirror-is-readonly');
	var disabled = codemirror.classList.contains('codemirror-is-disabled');
	var hasCounter = textarea.parentNode.parentNode.querySelector('.field-counter');

	// Initialize Codemirror
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
	};

	$field.data('markdown', true);

	//
	// Fix overflow bug in Panel – this workaround is not ideal :(
	//
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
		}
	};

	function isDescendant(parent, child) {
		var node = child.parentNode;
		while (node != null) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	};

	var inModal = isDescendant(document.querySelector('.app > .modal'), textarea)
	var field = textarea.parentNode.parentNode;
	var fieldPadding = parseFloat($(field).css('padding-left'));

	function fixOverflowBug(){
		var widthFactor = 1;
		var formWidth = document.querySelector('.mainbar .form').offsetWidth;
		if (inModal) formWidth = document.querySelector('.modal .form').offsetWidth;

		if (window.matchMedia('screen and (min-width:50em)').matches) {
			if (field.classList.contains('field-grid-item-1-2') || field.classList.contains('field-grid-item-2-4')) {
				widthFactor = 0.5;
			}
			else if (field.classList.contains('field-grid-item-1-3')) {
				widthFactor = 0.333;
			}
			else if (field.classList.contains('field-grid-item-2-3')) {
				widthFactor = 0.666;
			}
			else if (field.classList.contains('field-grid-item-1-4')) {
				widthFactor = 0.25;
			}
			else if (field.classList.contains('field-grid-item-3-4')) {
				widthFactor = 0.75;
			}
			else if (field.classList.contains('field-grid-item-1-5')) {
				widthFactor = 0.2;
			}
			else if (field.classList.contains('field-grid-item-2-5')) {
				widthFactor = 0.4;
			}
			else if (field.classList.contains('field-grid-item-3-5')) {
				widthFactor = 0.6;
			}
			else if (field.classList.contains('field-grid-item-4-5')) {
				widthFactor = 0.8;
			}

			// Add width to prevent text overflow
			codemirror.style.width = (((formWidth - fieldPadding) * widthFactor) - fieldPadding) / 16 + 'em';
		}
		else{
			if (inModal) formWidth -= fieldPadding * 2;
			codemirror.style.width = formWidth / 16 + 'em';
		}
	}

	fixOverflowBug();

	setTimeout(function(){
		// Fix wrong cursor position
		editor.refresh();
		// Fix modal position
		if (inModal) $(document).trigger('keyup.center');
	}, 100);

	window.addEventListener('resize', throttle(fixOverflowBug, 100));
};

(function($) {
	$.fn.markdown = function() {
		return new MarkdownField(this);
	};
})(jQuery);
