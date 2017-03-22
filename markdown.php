<?php

class MarkdownField extends TextField {

	static public $assets = array(
		'css' => array(
			'codemirror.css',
			'editor.css'
		),
		'js' => array(
			'codemirror.js',
			'placeholder.js',
			'overlay.js',
			'simple.js',
			'xml.js',
			'markdown.js',
			'kirbytext.js',
			'editor.js'
		)
	);

	public function __construct() {
		$this->label = l::get('fields.textarea.label', 'Text');
	}

	public function input() {
		$input = parent::input();
		$input->tag('textarea');
		$input->removeAttr('type');
		$input->removeAttr('value');
		$input->html($this->value() ? htmlentities($this->value(), ENT_NOQUOTES, 'UTF-8') : false);
		$input->data('field', 'markdown');
		$input->removeAttr('required');

		return $input;
	}

	public function result() {
		return str_replace(array("\r\n", "\r"), "\n", parent::result());
	}

	public function element() {
		$element = parent::element();
		$element->addClass('field-with-textarea field-with-codemirror');

		return $element;
	}

	public function content() {
		$content = parent::content();

		$div = new Brick('div');
		$div->addClass('codemirror');
		if($this->readonly) $div->addClass('codemirror-is-readonly');
		if($this->disabled) $div->addClass('codemirror-is-disabled');

		$content->append($div);

		return $content;
	}
}
