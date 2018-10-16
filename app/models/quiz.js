import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  description: DS.attr(),
  duration: DS.attr(),
  maxAttempts: DS.attr(),
  questions: DS.hasMany('question'),
  questionCount: Ember.computed ('questions.[]', function () {
    return this.get ('questions.length')
  })
})
