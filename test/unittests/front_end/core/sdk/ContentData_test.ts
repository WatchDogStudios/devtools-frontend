// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as Platform from '../../../../../front_end/core/platform/platform.js';
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';

describe('ContentData', () => {
  const {ContentData} = SDK.ContentData;
  type ContentDataOrError = SDK.ContentData.ContentDataOrError;
  const {MimeType} = Platform.MimeType;

  it('throws an error when trying to encode text content into base64', () => {
    const contentData = new ContentData('a simple text', false, MimeType.HTML);

    assert.throws(() => contentData.base64);
  });

  it('decodes text based on the provided encoding', () => {
    const contentData = new ContentData(
        '//48ACEARABPAEMAVABZAFAARQAgAGgAdABtAGwAPgAKADwAcAA+AEkA8QB0AOsAcgBuAOIAdABpAPQAbgDgAGwAaQB6AOYAdABpAPgAbgADJjTYBt88AC8AcAA+AAoA',
        true, MimeType.HTML, 'utf-16');

    assert.strictEqual(contentData.text, '<!DOCTYPE html>\n<p>Iñtërnâtiônàlizætiøn☃𝌆</p>\n');
  });

  it('throws an error  when trying to decode data not considered text content', () => {
    const contentData = new ContentData('AQIDBA==', true, 'application/wasm');

    assert.throws(() => contentData.text);
  });

  it('treats an empty string for charset as utf-8', () => {
    const contentData = new ContentData(
        'PCFET0NUWVBFIGh0bWw+CjxwPknDsXTDq3Juw6J0acO0bsOgbGl6w6Z0acO4buKYg/CdjIY8L3A+Cg==', true, MimeType.HTML, '');

    assert.strictEqual(contentData.text, '<!DOCTYPE html>\n<p>Iñtërnâtiônàlizætiøn☃𝌆</p>\n');
  });

  it('converts to a data URL', () => {
    const textContent = new ContentData('a simple text', false, MimeType.HTML);
    assert.strictEqual(textContent.asDataUrl(), 'data:text/html,a simple text');

    const binaryData = new ContentData('AQIDBA==', true, 'application/wasm');
    assert.strictEqual(binaryData.asDataUrl(), 'data:application/wasm;base64,AQIDBA==');

    const textAsBase64Utf16 = new ContentData(
        '//48ACEARABPAEMAVABZAFAARQAgAGgAdABtAGwAPgAKADwAcAA+AEkA8QB0AOsAcgBuAOIAdABpAPQAbgDgAGwAaQB6AOYAdABpAPgAbgADJjTYBt88AC8AcAA+AAoA',
        true, MimeType.HTML, 'utf-16');
    assert.strictEqual(
        textAsBase64Utf16.asDataUrl(),
        'data:text/html;charset=utf-16;base64,//48ACEARABPAEMAVABZAFAARQAgAGgAdABtAGwAPgAKADwAcAA+AEkA8QB0AOsAcgBuAOIAdABpAPQAbgDgAGwAaQB6AOYAdABpAPgAbgADJjTYBt88AC8AcAA+AAoA');
  });

  it('does not include charset for already decoded text in the data URL', () => {
    const textWithCharsetContent = new ContentData('a simple text', false, MimeType.HTML, 'utf-16');
    assert.strictEqual(textWithCharsetContent.asDataUrl(), 'data:text/html,a simple text');
  });

  it('converts to DeferredContent', () => {
    const textContent = new ContentData('a simple text', false, MimeType.HTML);
    const deferredTextContent = textContent.asDeferedContent();

    assert.isFalse(deferredTextContent.isEncoded);
    assert.strictEqual(deferredTextContent.content, 'a simple text');

    const binaryData = new ContentData('AQIDBA==', true, 'application/wasm');
    const deferredBinaryData = binaryData.asDeferedContent();

    assert.isTrue(deferredBinaryData.isEncoded);
    assert.strictEqual(deferredBinaryData.content, 'AQIDBA==');
  });

  it('converts ContentDataOrError to DeferredContent', () => {
    const textContent: ContentDataOrError = new ContentData('a simple text', false, MimeType.HTML);
    const deferredTextContent = ContentData.asDeferredContent(textContent);

    assert.isFalse(deferredTextContent.isEncoded);
    assert.strictEqual(deferredTextContent.content, 'a simple text');

    const error: ContentDataOrError = {error: 'something went wrong'};
    const deferedErrorContent = ContentData.asDeferredContent(error);

    // TypeScript somehow doesn't think DeferredContent.error is a thing.
    assert.property(deferedErrorContent, 'error');
    assert.propertyVal(deferedErrorContent, 'error', 'something went wrong');
  });
});
