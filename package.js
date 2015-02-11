Package.describe({
  name: 'frozeman:inline-form',
  summary: 'An input and select element for usage in a text',
  version: '0.0.1',
  git: 'http://github.com/frozeman/meteor-inline-form'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('jquery', 'client');
  api.use('templating', 'client');
  api.use('less', 'client');

  api.use('frozeman:animation-helper@0.2.5', 'client');
  api.use('frozeman:template-var@1.0.5', 'client');
  api.use('frozeman:simple-modal@0.0.6', 'client');

  api.addFiles('main.less', 'client');

  api.addFiles('inlineForm.html', 'client');
  api.addFiles('inlineForm.js', 'client');
});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('frozeman:inline-form');
//   api.addFiles('inline-form-tests.js');
// });

