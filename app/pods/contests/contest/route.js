import Ember from 'ember';

const { inject: { service } } = Ember;

export default Ember.Route.extend({
  currentContest: service('current-contest'),

  model (params) {
    const contestId = params.contest_id;
    return Ember.RSVP.hash({
      contest: this.get('store').findRecord('contest', contestId, {reload: true})
    })
  },

  afterModel(model, transition) {
    if (!model.contest){
      transition.abort()
      this.transitionTo('contests.denied')
    }
    this.get('currentContest').setContest(model.contest)
  }
});
