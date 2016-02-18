#!/usr/bin/env python
# encoding: utf-8

'''
Licensed under a 3-clause BSD license.

Revision History:
    Initial Version: 2016-02-17 17:46:57
    Last Modified On: 2016-02-17 17:46:57 by Brian

'''
from __future__ import print_function
from __future__ import division
from flask.ext.classy import FlaskView
from flask import request, Blueprint
from marvin import config

api = Blueprint("api", __name__)


def processRequest(request=None):
    ''' Function to generally process the request for POST or GET, and build a form dict '''

    # get form data
    if request.method == 'POST':
        data = request.form
    elif request.method == 'GET':
        data = request.args
    else:
        return None

    # build form dictionary
    form = {key: val if len(val) > 1 else val[0] for key, val in data.iterlists()}

    return form


class BaseView(FlaskView):
    ''' Super Clase for all API Views to handle all global API things of interest '''

    def __init__(self):
        self.reset_results()
        config.mode = 'local'

    def reset_results(self):
        ''' Resets results to return from API as JSON. '''
        self.results = {'data': None, 'status': -1, 'error': None}

    def update_results(self, newresults):
        ''' Add to or Update the results dictionary '''
        self.results.update(newresults)

    def reset_status(self):
        ''' Resets the status to -1 '''
        self.results['status'] = -1

    def add_config(self):
        outconfig = {'outconfig': {'drpver': config.drpver, 'mode': config.mode, 'dapver': config.dapver, 'mplver': config.mplver}}
        self.update_results(outconfig)

    def before_request(self, *args, **kwargs):
        ''' '''
        form = processRequest(request=request)
        self.results['inconfig'] = form
        for key, val in form.items():
            config.__setattr__(key, val)
        self.add_config()

    def after_request(self, name, response):
        ''' This performs a reset of the results dict after every request method runs.  See Flask-Classy for more info on after_request '''
        self.reset_results()
        return response


