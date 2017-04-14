import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Sheet from './sheet';
import {playAudio} from './audio';


class CurriculumApp extends React.Component {

    constructor() {
        super();
        var urlPath = window.location.pathname.split('/');
        this.state = {
            currentView: urlPath[2] || urlPath[1],
            currentId: urlPath[3] || 'default',
            sections: [],
        };
        this.fetchState();

        this.curriculum = null;
    }

    load() {
        console.log('LOADING');
        if (!this.curriculum) {
            return;
        }
        var sections = [];
        for(var unitIndex = 0; unitIndex < this.curriculum.units.length; unitIndex++) {
            var unit = this.curriculum.units[unitIndex];
            var items = [];
            for(var moduleIndex = 0; moduleIndex < unit.modules.length; moduleIndex++) {
                var module = unit.modules[moduleIndex];
                var name = module.name + ' ';
                if (!module.is_locked) {
                    name += '(' + module.lesson_completed_count + '/' + module.lesson_count + ') ';
                }
                items.push({
                    name: name,
                    image: module.image,
                    href: '/modules/' + module.uuid,
                    uuid: module.uuid,
                    status: module.status,
                });
            }
            sections.push({
                name: unit.name,
                items: items,
                uuid: unit.uuid,
            });
        }
        this.setState({
            sections: sections,
            backLink: null,
            question: null,
            progress: 0,
            answer: null,
        });
    }

    fetchState() {
        console.log('FETCHING');
        $.ajax({
            url: '/api/v1/curricula/curricula/' + this.state.currentId,
            data: {'expand': 'units.modules'},
            context: this,
            success: function(data, status, jqXHR) {
                console.log('FETCHED');
                this.curriculum = data;
                this.load();
            }
        });
    }

    render() {
        return (
            <Sheet
                sections={this.state.sections}
            />
        );
    }

}


class ModulesApp extends React.Component {

    constructor() {
        super();
        var urlPath = window.location.pathname.split('/');
        this.state = {
            currentView: urlPath[2] || urlPath[1],
            currentId: urlPath[3] || 'default',
            sections: [],
        };
        this.fetchState();

        this.curriculum = null;
        this.module = null;
    }

    load() {
        if (!this.module) {
            return;
        }
        var items = [];
        for(var lessonIndex = 0; lessonIndex < this.module.lessons.length; lessonIndex++) {
            var lesson = this.module.lessons[lessonIndex];
            items.push({
                name: lesson.name + ' ',
                image: lesson.image,
                href: '/lessons/' + lesson.uuid,
                // action: this.getLessonAction(lesson),
                uuid: lesson.uuid,
                status: lesson.status,
            });
        }
        var sections = [{
            name: this.module.name,
            items: items,
            uuid: this.module.uuid,
        }];
        this.setState({
            sections: sections,
            backLink: '/curriculum/',
            question:null,
            progress: 0,
            answer: null,
        });
    }

    fetchState() {
        $.ajax({
            url: '/api/v1/curricula/modules/' + this.state.currentId,
            data: {'expand': 'lessons'},
            context: this,
            success: function(data, status, jqXHR) {
                this.module = data;
                this.load();
            }
        });
    }

    render() {
        return (
            <Sheet
                backLink={this.state.backLink}
                sections={this.state.sections}
            />
        );
    }

}


class LessonsApp extends React.Component {

    constructor() {
        super();
        var urlPath = window.location.pathname.split('/');
        this.state = {
            currentView: urlPath[2] || urlPath[1],
            currentId: urlPath[3] || 'default',
            sections: [],
            question: null,
            backLink: null,
            progress: 0,
        };
        this.fetchState();

        this.curriculum = null;
        this.module = null;
        this.question = null;
        this.progress = 0;
        this.answer = null;
    }

    load() {
        if (!this.question) {
            return;
        }
        this.setState({
            sections: null,
            backLink: null,
            question: this.question,
            progress: this.progress,
            answer: this.answer,
        });
    }

    submitAnswer(questionId, obj) {
        $.ajax({
            type: 'POST',
            url: '/api/v1/curricula/questions/' + questionId + '/response',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(obj),
            // We must block on this call so that the audio works on mobile
            // (audio must be a result of a click).
            async: false,
            context: this,
            success: function(data, status, jqXHR) {
                this.question.response = obj;
                this.progress = data['score'] / data['required_score'] * 100;
                if (data.was_correct) {
                    this.question.is_correct = true;
                    playAudio('correct');
                } else {
                    this.question.is_correct = false;
                    if (data.correct_answer.type == 'vector') {
                        this.answer = {
                            type: 'vector',
                            xComponent: data.correct_answer.content.x_component,
                            yComponent: data.correct_answer.content.y_component,
                        };
                    } else {
                        this.answer = data.correct_answer;
                    }
                    playAudio('incorrect');
                }
                this.load();
                if (data.was_correct) {
                    setTimeout(
                        function() {
                            this.fetchState(this.state.currentId);
                        }.bind(this),
                        500
                    );
                }
            }
        });
    }

    continueAction() {
        playAudio('continue');
        this.fetchState();
    }

    hintClick() {
        this.question.hintCollapsed = !this.question.hintCollapsed;
        this.load();
    }

    fetchState() {
        var data = {};
        if (this.question) {
            data['previous_question'] = this.question.uuid
        }
        $.ajax({
            url: '/api/v1/curricula/lessons/' + this.state.currentId + '/next-question',
            context: this,
            data: data,
            success: function(data, status, jqXHR) {
                this.progress = data['score'] / data['required_score'] * 100;
                data.submitAnswer = this.submitAnswer.bind(this);
                this.question = data;
                this.question.hintCollapsed = true;
                this.answer = null;
                this.load();
            }
        });
    }

    render() {
        return (
            <Sheet
                backLink={this.state.backLink}
                sections={this.state.sections}
                question={this.state.question}
                answer={this.state.answer}
                progress={this.state.progress}
                continueAction={this.continueAction.bind(this)}
                hintClick={this.hintClick.bind(this)}
            />
        );
    }

}


export default class CurriculumRouter extends React.Component {

    render() {
        return (
            <BrowserRouter basename="/curriculum">
                <Switch>
                    <Route path='/lessons/*' component={LessonsApp} />
                    <Route path='/modules/*' component={ModulesApp} />
                    <Route path='/' component={CurriculumApp} />
                </Switch>
            </BrowserRouter>
        );
    }

}
