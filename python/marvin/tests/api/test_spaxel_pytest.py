# !usr/bin/env python2
# -*- coding: utf-8 -*-
#
# Licensed under a 3-clause BSD license.
#
# @Author: Brian Cherinka
# @Date:   2017-05-19 17:56:30
# @Last modified by:   Brian Cherinka
# @Last Modified time: 2017-05-19 19:00:16

from __future__ import print_function, division, absolute_import
from marvin.tests.api.conftest import ApiPage
import pytest


@pytest.fixture()
def page(client, request, init_api):
    blue, endpoint = request.param
    page = ApiPage(client, 'api', endpoint)
    yield page


@pytest.fixture()
def params(release):
    return {'release': release}


@pytest.mark.parametrize('page', [('api', 'getSpectrum')], ids=['getspectrum'], indirect=True)
class TestGetSpectrum(object):

    @pytest.mark.parametrize('reqtype', [('get'), ('post')])
    @pytest.mark.parametrize('x, y', [(17, 17)])
    def test_spec_success(self, galaxy, page, params, reqtype, x, y):
        params.update({'name': galaxy.plateifu, 'x': x, 'y': y})
        data = {'flux': [], 'ivar': [], 'mask': [], 'wavelength': [], 'specres': []}
        page.load_page(reqtype, page.url.format(**params), params=params)
        page.assert_success(data, keys=True)

    @pytest.mark.parametrize('reqtype', [('get'), ('post')])
    @pytest.mark.parametrize('name, missing, errmsg, x, y',
                             [(None, 'release', 'Missing data for required field.', 0, 0),
                              ('badname', 'name', 'String does not match expected pattern.', 0, 0),
                              ('84', 'name', 'Shorter than minimum length 4.', 0, 0),
                              ('8485-1901', 'x', 'Must be between 0 and 100.', -1, 17),
                              ('8485-1901', 'y', 'Must be between 0 and 100.', 17, -1)],
                             ids=['norelease', 'badname', 'shortname', 'badx', 'bady'])
    def test_spec_failure(self, galaxy, page, reqtype, params, name, missing, errmsg, x, y):
        params.update({'name': name, 'x': x, 'y': y})
        if name is None:
            params.update({'name': galaxy.plateifu})
            page.route_no_valid_params(page.url.format(**params), missing, reqtype=reqtype, errmsg=errmsg)
        else:
            page.route_no_valid_params(page.url.format(**params), missing, reqtype=reqtype, params=params, errmsg=errmsg)


@pytest.mark.parametrize('page', [('api', 'getProperties')], ids=['getproperties'], indirect=True)
class TestGetProperties(object):

    @pytest.mark.parametrize('reqtype', [('get'), ('post')])
    @pytest.mark.parametrize('x, y, expprop, expval',
                             [(17, 17, "emline_gflux_ha_6564", {
                                       "channel": "ha_6564",
                                       "description": "Gaussian profile integrated flux for emission lines.",
                                       "ivar": 47.0896851561,
                                       "mask": 0,
                                       "name": "emline_gflux",
                                       "unit": "1E-17 erg/s/cm^2/spaxel",
                                       "value": 31.4754
                             })])
    def test_props_success(self, galaxy, page, params, reqtype, x, y, expprop, expval):
        params.update({'name': galaxy.plateifu, 'x': x, 'y': y, 'template_kin': galaxy.template})
        page.load_page(reqtype, page.url.format(**params), params=params)
        page.assert_success()
        props = page.json['data']['properties']
        assert expprop in props
        assert expval == props[expprop]

    @pytest.mark.parametrize('reqtype', [('get'), ('post')])
    @pytest.mark.parametrize('name, missing, errmsg, x, y, template',
                             [(None, 'release', 'Missing data for required field.', 0, 0, None),
                              ('badname', 'name', 'String does not match expected pattern.', 0, 0, None),
                              ('84', 'name', 'Shorter than minimum length 4.', 0, 0, 'GAU-MILESHC'),
                              ('8485-1901', 'x', 'Must be between 0 and 100.', -1, 17, 'GAU-MILESHC'),
                              ('8485-1901', 'y', 'Must be between 0 and 100.', 17, -1, 'GAU-MILESHC'),
                              ('8485-1901', 'template_kin', 'Not a valid choice.', 17, 17, 'MILESHC')],
                             ids=['norelease', 'badname', 'shortname', 'badx', 'bady', 'badtemplate'])
    def test_props_failure(self, galaxy, page, reqtype, params, name, missing, errmsg, x, y, template):
        params.update({'name': name, 'x': x, 'y': y, 'template_kin': template})
        if name is None:
            params.update({'name': galaxy.plateifu})
            page.route_no_valid_params(page.url.format(**params), missing, reqtype=reqtype, errmsg=errmsg)
        else:
            page.route_no_valid_params(page.url.format(**params), missing, reqtype=reqtype, params=params, errmsg=errmsg)


@pytest.mark.parametrize('page', [('api', 'getModels')], ids=['getmodels'], indirect=True)
class TestGetModels(object):

    @pytest.mark.parametrize('reqtype', [('get'), ('post')])
    @pytest.mark.parametrize('x, y, expdata',
                             [(17, 17, (0.471273, 128.573, 32, 0, 0, 0, 128))])
    def test_models_success(self, galaxy, page, params, reqtype, x, y, expdata):
        params.update({'name': galaxy.plateifu, 'x': x, 'y': y, 'template_kin': galaxy.template})
        page.load_page(reqtype, page.url.format(**params), params=params)
        data = {'bintype': galaxy.bintype, 'template_kin': galaxy.template, 'flux_array': [],
                'flux_mask': [], 'flux_ivar': [], 'model_array': [], 'model_emline': [],
                'model_emline_base': [], 'model_emline_mask': []}
        page.assert_success(data, keys=True)
        jdata = page.json['data']
        mcdata = (jdata['flux_array'][0], jdata['flux_ivar'][0], jdata['flux_mask'][0],
                  jdata['model_array'][0], jdata['model_emline'][0], jdata['model_emline_base'][0],
                  jdata['model_emline_mask'][0])
        assert expdata == mcdata

    @pytest.mark.parametrize('reqtype', [('get'), ('post')])
    @pytest.mark.parametrize('name, missing, errmsg, x, y, template',
                             [(None, 'release', 'Missing data for required field.', 0, 0, None),
                              ('badname', 'name', 'String does not match expected pattern.', 0, 0, None),
                              ('84', 'name', 'Shorter than minimum length 4.', 0, 0, 'GAU-MILESHC'),
                              ('8485-1901', 'x', 'Must be between 0 and 100.', -1, 17, 'GAU-MILESHC'),
                              ('8485-1901', 'y', 'Must be between 0 and 100.', 17, -1, 'GAU-MILESHC'),
                              ('8485-1901', 'template_kin', 'Not a valid choice.', 17, 17, 'MILESHC')],
                             ids=['norelease', 'badname', 'shortname', 'badx', 'bady', 'badtemplate'])
    def test_models_failure(self, galaxy, page, reqtype, params, name, missing, errmsg, x, y, template):
        params.update({'name': name, 'x': x, 'y': y, 'template_kin': template})
        if name is None:
            params.update({'name': galaxy.plateifu})
            page.route_no_valid_params(page.url.format(**params), missing, reqtype=reqtype, errmsg=errmsg)
        else:
            page.route_no_valid_params(page.url.format(**params), missing, reqtype=reqtype, params=params, errmsg=errmsg)
