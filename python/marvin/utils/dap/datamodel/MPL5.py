#!/usr/bin/env python
# encoding: utf-8
#
# MPL5.py
#
# Created by José Sánchez-Gallego on 8 Aug 2017.


from __future__ import division
from __future__ import print_function
from __future__ import absolute_import

from astropy import units as u

from .base import Bintype, Template, DAPDataModel, Property, MultiChannelProperty, spaxel, Channel
from .MPL4 import MPL4_emline_channels


GAU_MILESHC = Template('GAU-MILESHC')

ALL = Bintype('ALL')
NRE = Bintype('NRE')
SPX = Bintype('SPX', binned=False)
VOR10 = Bintype('VOR10')


last_idx = len(MPL4_emline_channels)
MPL5_emline_channels = MPL4_emline_channels + [
    Channel('oii_3727', formats={'string': 'OII 3727',
                                 'latex': r'$\forb{O\,II}\;\lambda 3727$'}, idx=last_idx + 1),
    Channel('oii_3729', formats={'string': 'OII 3729',
                                 'latex': r'$\forb{O\,II}\;\lambda 3729$'}, idx=last_idx + 2),
    Channel('heps_3971', formats={'string': 'H-epsilon 3971',
                                  'latex': r'H$\epsilon\;\lambda 3971$'}, idx=last_idx + 3),
    Channel('hdel_4102', formats={'string': 'H-delta 4102',
                                  'latex': r'H$\delta\;\lambda 4102$'}, idx=last_idx + 4),
    Channel('hgam_4341', formats={'string': 'H-gamma 4341',
                                  'latex': r'H$\gamma\;\lambda 4341$'}, idx=last_idx + 5),
    Channel('heii_4687', formats={'string': 'HeII 4681',
                                  'latex': r'He\,II$\;\lambda 4687$'}, idx=last_idx + 6),
    Channel('hei_5877', formats={'string': 'HeI 5877',
                                 'latex': r'He\,I$\;\lambda 5877$'}, idx=last_idx + 7),
    Channel('siii_8831', formats={'string': 'SIII 8831',
                                  'latex': r'$\forb{S\,III}\;\lambda 8831$'}, idx=last_idx + 8),
    Channel('siii_9071', formats={'string': 'SIII 9071',
                                  'latex': r'$\forb{S\,III}\;\lambda 9071$'}, idx=last_idx + 9),
    Channel('siii_9533', formats={'string': 'SIII 9533',
                                  'latex': r'$\forb{S\,III}\;\lambda 9533$'}, idx=last_idx + 10)
]

MPL5_specindex_channels = [
    Channel('d4000', formats={'string': 'D4000'}, unit=u.Angstrom, idx=0),
    Channel('dn4000', formats={'string': 'Dn4000'}, unit=u.Angstrom, idx=1)
]


MPL5_maps = [
    MultiChannelProperty('spx_skycoo', ivar=False, mask=False,
                         channels=[Channel('on_sky_x', formats={'string': 'On-sky X'}, idx=0),
                                   Channel('on_sky_y', formats={'string': 'On-sky Y'}, idx=1)],
                         unit=u.arcsec,
                         formats={'string': 'Sky coordinates'},
                         description='Offsets of each spaxel from the galaxy center.'),
    MultiChannelProperty('spx_ellcoo', ivar=False, mask=False,
                         channels=[Channel('elliptical_radius',
                                           formats={'string': 'Elliptical radius'},
                                           idx=0, unit=u.arcsec),
                                   Channel('elliptical_azimuth',
                                           formats={'string': 'Elliptical azimuth'},
                                           idx=1, unit=u.deg)],
                         formats={'string': 'Elliptical coordinates'},
                         description='Elliptical polar coordinates of each spaxel from '
                                     'the galaxy center.'),
    Property('spx_mflux', ivar=True, mask=False,
             unit=u.erg / u.s / (u.cm ** 2) / spaxel, scale=1e-17,
             formats={'string': 'r-band mean flux'},
             description='Mean flux in r-band (5600.1-6750.0 ang).'),
    Property('spx_snr', ivar=False, mask=False,
             formats={'string': 'r-band SNR'},
             description='r-band signal-to-noise ratio per pixel.'),
    Property('binid', ivar=False, mask=False, unit=None,
             formats={'string': 'Bin ID'},
             description='Numerical ID for spatial bins.'),
    MultiChannelProperty('bin_lwskycoo', ivar=False, mask=False,
                         channels=[Channel('lum_weighted_on_sky_x',
                                           formats={'string': 'Light-weighted offset X'},
                                           idx=0, unit=u.arcsec),
                                   Channel('lum_weighted_on_sky_y',
                                           formats={'string': 'Light-weighted offset Y'},
                                           idx=1, unit=u.arcsec)],
                         description='Light-weighted offset of each bin from the galaxy center.'),
    MultiChannelProperty('bin_lwellcoo', ivar=False, mask=False,
                         channels=[Channel('lum_weighted_elliptical_radius',
                                           formats={'string': 'Light-weighted radial offset'},
                                           idx=0, unit=u.arcsec),
                                   Channel('lum_weighted_elliptical_azimuth',
                                           formats={'string': 'Light-weighted azimuthal offset'},
                                           idx=1, unit=u.deg)],
                         description='Light-weighted elliptical polar coordinates of each bin '
                                     'from the galaxy center.'),
    Property('bin_area', ivar=False, mask=False,
             unit=u.arcsec ** 2,
             formats={'string': 'Bin area'},
             description='Area of each bin.'),
    Property('bin_farea', ivar=False, mask=False,
             unit=None,
             formats={'string': 'Bin fractional area'},
             description='Fractional area that the bin covers for the expected bin '
                         'shape (only relevant for radial binning).'),
    Property('bin_mflux', ivar=True, mask=True,
             unit=u.erg / u.s / (u.cm ** 2) / spaxel, scale=1e-17,
             formats={'string': 'r-band binned spectra mean flux'},
             description='Mean flux in the r-band for the binned spectra.'),
    Property('bin_snr', ivar=False, mask=False,
             unit=None,
             formats={'string': 'Bin SNR'},
             description='r-band signal-to-noise ratio per pixel in the binned spectra.'),
    Property('stellar_vel', ivar=True, mask=True,
             unit=u.km / u.s,
             formats={'string': 'Stellar velocity'},
             description='Stellar velocity relative to NSA redshift.'),
    Property('stellar_sigma', ivar=True, mask=True,
             unit=u.km / u.s,
             formats={'string': 'Stellar velocity dispersion', 'latex': r'Stellar $\sigma$'},
             description='Stellar velocity dispersion (must be corrected using '
                         'STELLAR_SIGMACORR)'),
    Property('stellar_sigmacorr', ivar=False, mask=False,
             unit=u.km / u.s,
             formats={'string': 'Stellar sigma correction', 'latex': r'Stellar $\sigma$ correction'},
             description='Quadrature correction for STELLAR_SIGMA to obtain the '
                         'astrophysical velocity dispersion.)'),
    MultiChannelProperty('stellar_cont_fresid', ivar=False, mask=False,
                         channels=[Channel('68th_percentile',
                                           formats={'string': '68th percentile',
                                                    'latex': r'68^{th} percentile'}, idx=0),
                                   Channel('99th_percentile',
                                           formats={'string': '99th percentile',
                                                    'latex': r'99^{th} percentile'}, idx=1)],
                         formats={'string': 'Fractional residual growth'},
                         description='68%% and 99%% growth of the fractional residuals between '
                                     'the model and data'),
    Property('stellar_cont_rchi2', ivar=False, mask=False,
             unit=None,
             formats={'string': 'Stellar continuum reduced chi-square',
                      'latex': r'Stellar\ continuum\ reduced\ \chi^2'},
             description='Reduced chi-square of the stellar continuum fit.'),
    MultiChannelProperty('emline_sflux', ivar=True, mask=True,
                         channels=MPL5_emline_channels,
                         formats={'string': 'Emission line summed flux'},
                         unit=u.erg / u.s / (u.cm ** 2) / spaxel, scale=1e-17,
                         description='Non-parametric summed flux for emission lines.'),
    MultiChannelProperty('emline_sew', ivar=True, mask=True,
                         channels=MPL5_emline_channels,
                         formats={'string': 'Emission line EW'},
                         unit=u.Angstrom,
                         description='Emission line non-parametric equivalent '
                                     'widths measurements.'),
    MultiChannelProperty('emline_gflux', ivar=True, mask=True,
                         channels=MPL5_emline_channels,
                         formats={'string': 'Emission line Gaussian flux'},
                         unit=u.erg / u.s / (u.cm ** 2) / spaxel, scale=1e-17,
                         description='Gaussian profile integrated flux for emission lines.'),
    MultiChannelProperty('emline_gvel', ivar=True, mask=True,
                         channels=MPL5_emline_channels,
                         formats={'string': 'Emission line Gaussian velocity'},
                         unit=u.km / u.s,
                         description='Gaussian profile velocity for emission lines.'),
    MultiChannelProperty('emline_gsigma', ivar=True, mask=True,
                         channels=MPL5_emline_channels,
                         formats={'string': 'Emission line Gaussian sigma',
                                  'latex': r'Emission line Gaussian $\sigma$'},
                         unit=u.km / u.s,
                         description='Gaussian profile velocity dispersion for emission lines; '
                                     'must be corrected using EMLINE_INSTSIGMA'),
    MultiChannelProperty('emline_instsigma', ivar=False, mask=False,
                         channels=MPL5_emline_channels,
                         formats={'string': 'Emission line instrumental sigma',
                                  'latex': r'Emission line instrumental $\sigma$'},
                         unit=u.km / u.s,
                         description='Instrumental dispersion at the fitted line center.'),
    MultiChannelProperty('specindex', ivar=True, mask=True,
                         channels=MPL5_specindex_channels,
                         formats={'string': 'Spectral index'},
                         description='Measurements of spectral indices.'),
    MultiChannelProperty('specindex_corr', ivar=False, mask=False,
                         channels=MPL5_specindex_channels,
                         formats={'string': 'Spectral index sigma correction',
                                  'latex': r'Spectral index $\sigma$ correction'},
                         description='Velocity dispersion corrections for the '
                                     'spectral index measurements '
                                     '(can be ignored for D4000, Dn4000).')
]


MPL5 = DAPDataModel('2.0.2', aliases=['MPL-5', 'MPL5'], bintypes=[ALL, NRE, VOR10, SPX],
                    templates=[GAU_MILESHC], properties=MPL5_maps,
                    default_bintype='SPX', default_template='GAU-MILESHC')
