import Ember from 'ember';

export default Ember.Route.extend({
  currentAttemptService: Ember.inject.service('current-attempt'),

  queryParams: {
    q: {
      replace: true,
      refreshModel: true
    }
  },

  model (params) {
    const quiz = this.modelFor ('contests.contest.quiz'),
      contest = this.modelFor ('contests.contest'),
      currentAttempt = this.get ('currentAttemptService').getCurrentAttempts(quiz.get ('contest').id)
    ;

    return Ember.RSVP.hash ({
      currentAttempt: currentAttempt,
      question: this.store.findRecord('question', quiz.get('questions').objectAt(params.q - 1).id),
      quiz: quiz,
      currentQuizAttempt: this.store.queryRecord ('quiz_attempt', {
        quizId: quiz.id,
        contestId: contest.id,
        custom: {
          ext: 'url',
          url: 'currentAttempt'
        }
      })
    })
  },

  afterModel (params) {
    let contest = params.quiz.get ('contest'),
      duration = contest.get ('duration'),
      { currentAttempt } = params
    ;

    if (duration && (! currentAttempt)) {
      this.transitionTo ('contests.denied', contest.id)
    }
  },

  renderTemplate () {
    this._super (...arguments)

    const questionContainer = document.querySelector ('.questions-container')

    if (window.MathJax && questionContainer) {
      Ember.run.later (_ => MathJax.Hub.Queue(["Typeset", MathJax.Hub, questionContainer]))
    }
  },

  actions: {
    didTransition () {
      Ember.run.later(() => {
        let objDiv = document.getElementById("qTitle");
        window.scrollTo ({top: Ember.$('#qTitle').offset().top - objDiv.scrollHeight});
      },500)
      return true;
    }
  }
});
