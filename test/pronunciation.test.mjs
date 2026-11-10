import test from 'node:test';import assert from 'node:assert/strict';import {pronunciationText} from '../server/pronunciation.mjs';
test('speech spelling preserves Hindi and normalises ambiguous names and loanwords',()=>{assert.equal(pronunciationText('Prakash की train का duty log।'),'प्रकाश की ट्रेन का ड्यूटी लॉग।');assert.equal(pronunciationText('निर्मला ने कहा।'),'निर्मला ने कहा।');});
