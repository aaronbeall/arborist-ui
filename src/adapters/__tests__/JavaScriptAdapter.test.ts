import * as utils from '../../utils/idGenerator';
jest.mock('../../utils/idGenerator', () => ({
  generateId: jest.fn()
}));
(utils.generateId as jest.Mock).mockReturnValue('mock-id');

import { JavaScriptAdapter } from '../JavaScriptAdapter';
import { exampleTree, expectedJavaScript } from '../../test/testData';
import { removeTreeNodeArrayElementNames } from '../../utils/treeNodeUtils';

describe('JavaScriptAdapter', () => {
  let adapter: JavaScriptAdapter;

  beforeEach(() => {
    adapter = new JavaScriptAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse JavaScript to tree structure', async () => {
    const result = await adapter.parse(expectedJavaScript);
    const expected = removeTreeNodeArrayElementNames(structuredClone(exampleTree));
    expect(result).toEqual(expected);
  });

  it('should stringify tree structure to JavaScript', async () => {
    const result = await adapter.stringify(exampleTree);
    expect(result).toBe(expectedJavaScript);
  });
});
