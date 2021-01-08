// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as ComponentHelpers from '../../component_helpers/component_helpers.js';
import * as Elements from '../../elements/elements.js';
import {makeCrumb} from './helpers.js';
ComponentHelpers.ComponentServerSetup.setup().then(() => renderComponent());

const renderComponent = (): void => {
  const component = new Elements.ElementsBreadcrumbs.ElementsBreadcrumbs();
  const bodyCrumb = makeCrumb({
    nodeType: Node.ELEMENT_NODE,
    nodeName: 'body',
    nodeNameNicelyCased: 'body',
    attributes: {
      class: 'body-class1 body-class2',
    },
  });

  const divCrumb = makeCrumb({
    nodeType: Node.ELEMENT_NODE,
    nodeName: 'div',
    nodeNameNicelyCased: 'div',
    attributes: {
      id: 'test-id',
      class: 'wrapper-div',
    },
  });

  const spanCrumb = makeCrumb({
    nodeType: Node.ELEMENT_NODE,
    nodeName: 'span',
    nodeNameNicelyCased: 'span',
    attributes: {
      id: 'my-span-has-a-long-id',
    },
  });

  const emCrumb = makeCrumb({
    nodeType: Node.ELEMENT_NODE,
    nodeName: 'em',
    nodeNameNicelyCased: 'em',
    attributes: {
      id: 'my-em-has-a-long-id',
    },
  });

  document.getElementById('container')?.appendChild(component);

  component.data = {
    crumbs: [emCrumb, spanCrumb, divCrumb, bodyCrumb],
    selectedNode: bodyCrumb,
  };
};
