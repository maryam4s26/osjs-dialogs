/*
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) 2011-2018, Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */

import {h, app} from 'hyperapp';
import Dialog from '../dialog';
import {
  Box,
  BoxContainer,
  Input
} from '@osjs/gui';

/**
 * Default OS.js Font Dialog
 */
export default class FontDialog extends Dialog {

  /**
   * Constructor
   * @param {Core} core OS.js Core reference
   * @param {Object} args Arguments given from service creation
   * @param {String} [args.title] Dialog title
   * @param {String} [args.message] Dialog message
   * @param {Function} callback The callback function
   */
  constructor(core, args, callback) {
    args = Object.assign({}, {
      title: 'Chose Font',
      minSize: 6,
      maxSize: 48,
      unit: 'px',
      name: 'Roboto',
      size: 10,
      style: 'regular',
      text: 'The quick brown fox jumps over the lazy dog',
      fonts: [
        'Roboto',
        'arial',
        'sans-serif',
        'monospace'
      ]
    }, args);

    super(core, args, {
      className: 'alert',
      window: {
        title: args.title,
        attributes: {
          minDimension: {
            width: 400,
            height: 200
          }
        }
      },
      buttons: ['close']
    }, callback);

    this.value = {
      name: this.args.name,
      size: this.args.size,
      style: this.args.style
    };
  }

  render(options) {
    const fontSizes = Array(this.args.maxSize - this.args.minSize)
      .fill(0)
      .map((v, i) => this.args.minSize + i)
      .reduce((o, i) => Object.assign(o, {[i]: i}), {});

    const fontNames = this.args.fonts
      .reduce((o, i) => Object.assign(o, {[i]: i}), {});

    const fontStyles = {
      'regular': 'Regular',
      'bold': 'Bold',
      'italic': 'Italic'
    };

    const initialState = Object.assign({}, this.value);
    const initialActions = {
      setSize: size => state => {
        this.value.size = size;
        return {size};
      },
      setFont: name => state => {
        this.value.name = name;
        return {name};
      },
      setStyle: style => state => {
        this.value.style = style;
        return {style};
      }
    };

    super.render(options, ($content) => {
      app(initialState, initialActions, (state, actions) => this.createView([
        h(BoxContainer, {padding: false}, [
          h(Box, {orientation: 'vertical'}, [
            h(BoxContainer, {shrink: 1}, h(Input, {
              type: 'select',
              value: state.size,
              choices: fontSizes,
              onchange: v => actions.setSize(v)
            })),
            h(BoxContainer, {grow: 1}, h(Input, {
              type: 'select',
              value: state.font,
              choices: fontNames,
              onchange: v => actions.setFont(v)
            })),
            h(BoxContainer, {shrink: 1}, h(Input, {
              type: 'select',
              value: state.size,
              choices: fontStyles,
              onchange: v => actions.setStyle(v)
            }))
          ])
        ]),
        h(BoxContainer, {grow: 0, shrink: 1}, [
          h(Input, {
            fill: true,
            type: 'textarea',
            value: this.args.text,
            inputStyle: {
              fontFamily: state.name,
              fontSize: `${state.size}${this.args.unit}`,
              fontWeight: state.style === 'bold' ? 'bold' : 'normal',
              fontStyle: state.style !== 'bold' ? state.style : 'normal',
              height: '4rem',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }
          })
        ])
      ]), $content);
    });
  }

}
