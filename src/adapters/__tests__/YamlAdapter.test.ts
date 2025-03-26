import * as utils from '../../utils/idGenerator';
jest.mock('../../utils/idGenerator', () => ({
  generateId: jest.fn()
}));
(utils.generateId as jest.Mock).mockReturnValue('mock-id');

import { YamlAdapter } from '../YamlAdapter';
import { exampleTree, expectedYaml } from '../../test/testData';
import { removeTreeNodeArrayElementNames, stringifyAllTreeNodeValues } from '../../utils/treeNodeUtils';


describe('YamlAdapter', () => {
  let adapter: YamlAdapter;

  beforeEach(() => {
    adapter = new YamlAdapter();
  });

  it('should parse YAML to tree structure', async () => {
    const result = await adapter.parse(expectedYaml);
    const noArrayElementNames = removeTreeNodeArrayElementNames(structuredClone(exampleTree));
    const allStringValues = stringifyAllTreeNodeValues(noArrayElementNames);
    expect(result).toEqual(allStringValues);
  });

  it('should stringify tree structure to YAML', async () => {
    const result = await adapter.stringify(exampleTree);
    expect(result).toBe(expectedYaml);
  });
});