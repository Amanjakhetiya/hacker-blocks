import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service(),
  beforeModel (transition) {
    let store = this.get ('store'),
      competitionId = transition.params['competitions.view'].id,
      attempt = store.queryRecord ('CompetitionAttempt', {
        competitionId: competitionId,
        custom: {
          ext: 'url',
          url: 'current'
        }
      })
    ;

    attempt
      .then (attempt => {
        if (! attempt) throw new Error ('Competition Attempt Not Found!')
      })
      .catch (_ => {
        this.transitionTo ('competitions.overview', competitionId)
      })
  },

  model (params) {
    let store = this.get ('store')

    const competition = store.findRecord ('competition', params.id, { reload:true })
    const leaderboard = store.query ('competition', {
      custom: {
        ext: 'url',
        url: `${params.id}/leaderboard`
      }
    })
    const collegeLeaderboard = this.get('api').request(`competitions/${params.id}/collegeLeaderboard`)
    return Ember.RSVP.hash({
      competition,
      leaderboard,
      collegeLeaderboard
    })
  },

  afterModel (model, transition) {
    model.competition.get ('contests').map (contest => this.get ('store').findRecord ('contest', contest.id))
  },

  setupController(controller, model){
    controller.set('competition', model.competition);
    controller.set('leaderboard', model.leaderboard);
    controller.set('collegeLeaderboard', model.collegeLeaderboard);
  }
});
