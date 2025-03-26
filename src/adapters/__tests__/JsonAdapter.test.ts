import * as utils from '../../utils/idGenerator';
jest.mock('../../utils/idGenerator', () => ({
  generateId: jest.fn()
}));
(utils.generateId as jest.Mock).mockReturnValue('mock-id');

import { JsonAdapter } from '../JsonAdapter';
import { exampleTree, expectedJson } from '../../test/testData';
import { setTreeNodeArrayElementNames } from '../../utils/treeNodeUtils';

describe('JsonAdapter', () => {
  let adapter: JsonAdapter;

  beforeEach(() => {
    adapter = new JsonAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse JSON to tree structure', async () => {
    const result = await adapter.parse(expectedJson);
    const expected = setTreeNodeArrayElementNames(structuredClone(exampleTree), "");
    expect(result).toEqual(expected);
  });

  it('should stringify tree structure to JSON', async () => {
    const result = await adapter.stringify(exampleTree);
    expect(result).toBe(expectedJson);
  });
});