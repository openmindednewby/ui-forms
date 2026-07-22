import React from 'react';

import { TextInput } from 'react-native';

import { attachControlId } from './attachControlId';
import { ThemedTextInput } from '../ThemedTextInput/ThemedTextInput';

const CANDIDATE = 'field-control-1';

describe('attachControlId', () => {
  it('attaches the id to a plain single-element child', () => {
    // The shape that made label association impossible before: `<Field><Input /></Field>` has no
    // seam for the caller to pass an id through.
    const { node, controlId } = attachControlId(<input />, CANDIDATE);

    expect(controlId).toBe(CANDIDATE);
    expect((node as React.ReactElement<{ id?: string }>).props.id).toBe(CANDIDATE);
  });

  it('leaves a child that already has an id alone and targets THAT id', () => {
    const { node, controlId } = attachControlId(<input id="chosen-by-caller" />, CANDIDATE);

    expect(controlId).toBe('chosen-by-caller');
    expect((node as React.ReactElement<{ id?: string }>).props.id).toBe('chosen-by-caller');
  });

  it('honours the legacy nativeID as an existing id', () => {
    // `nativeID` is RN's pre-0.71 spelling of `id` and still reaches the DOM, so a control
    // carrying only it is already addressable and must not be given a competing second id.
    const { controlId } = attachControlId(<TextInput nativeID="legacy" />, CANDIDATE);

    expect(controlId).toBe('legacy');
  });

  it('wires the describing lines to a plain child too', () => {
    // Without this, a field whose hint carries the ONLY explanation of its state — "remove the
    // image first" on a read-only input — showed that sentence on screen and announced nothing.
    const { node } = attachControlId(<input />, CANDIDATE, 'field-hint-1');

    expect((node as React.ReactElement<{ describedById?: string }>).props.describedById).toBe('field-hint-1');
  });

  it('does not overwrite a describedById the child set itself', () => {
    // A kit control, since `describedById` is the kit's prop, not a DOM attribute.
    const { node } = attachControlId(<ThemedTextInput describedById="mine" />, CANDIDATE, 'field-hint-1');

    expect((node as React.ReactElement<{ describedById?: string }>).props.describedById).toBe('mine');
  });

  it.each([
    ['a fragment of two controls', <><input key="a" /><input key="b" /></>],
    ['plain text', 'not a control'],
    ['nothing', null],
  ])('reports no target for %s rather than guessing', (_case, child) => {
    // The important half: `controlId` comes back undefined so `FieldLabel` emits NO htmlFor.
    // A `<label for>` pointing at an element that does not exist would still satisfy a naive
    // "does this page have labels?" check while doing nothing at all.
    const { controlId } = attachControlId(child as React.ReactNode, CANDIDATE);

    expect(controlId).toBeUndefined();
  });

  it('returns an unclonable child unchanged', () => {
    expect(attachControlId('text', CANDIDATE).node).toBe('text');
  });
});
