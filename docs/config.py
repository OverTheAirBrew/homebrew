# -*- coding: utf-8 -*-

import sys, os

extensions = ['sphinx.ext.intersphinx']

exclude_trees = []
pygments_style = 'sphinx'

import sphinx_rtd_theme

html_theme = "sphinx_rtd_theme"

html_theme_path = [sphinx_rtd_theme.get_html_theme_path()]

html_theme_options = {
   'collapse_navigation': False,

}