import { TreeNode } from '../types';
import { findNodeById, findParentPath, getFilteredNodes, collectAllIds } from './treeUtils';

const sampleTree: TreeNode = {
  id: 'root',
  name: 'Root',
  type: 'object',
  children: [
    {
      id: 'a',
      name: 'Node A',
      type: 'object',
      value: '123',
      children: [
        { id: 'a1', name: 'Node A1', type: 'object' },
        { id: 'a2', name: 'Node A2', type: 'object' }
      ]
    },
    {
      id: 'b',
      name: 'Node B',
      type: 'object',
      children: [
        { id: 'b1', name: 'Node B1', type: 'object' }
      ]
    }
  ]
};

describe('findNodeById', () => {
  it('should find node by id', () => {
    expect(findNodeById(sampleTree, 'a1')?.name).toBe('Node A1');
    expect(findNodeById(sampleTree, 'b')?.name).toBe('Node B');
  });

  it('should return null for non-existent id', () => {
    expect(findNodeById(sampleTree, 'xyz')).toBeNull();
  });
});

describe('findParentPath', () => {
  it('should find path to node', () => {
    const target = findNodeById(sampleTree, 'a1')!;
    const path = findParentPath(sampleTree, target);
    expect(path.map(n => n.id)).toEqual(['root', 'a']);
  });
});

describe('getFilteredNodes', () => {
  it('should find matching nodes and their ancestors', () => {
    const result = getFilteredNodes(sampleTree, 'A1');
    expect(result.matches.has('a1')).toBe(true);
    expect(result.visible.has('root')).toBe(true);
    expect(result.visible.has('a')).toBe(true);
  });

  it('should match by value', () => {
    const result = getFilteredNodes(sampleTree, '123');
    expect(result.matches.has('a')).toBe(true);
  });
});

describe('collectAllIds', () => {
  it('should collect all node ids', () => {
    const ids = collectAllIds(sampleTree);
    expect(ids.size).toBe(6);
    expect(ids.has('root')).toBe(true);
    expect(ids.has('a')).toBe(true);
    expect(ids.has('a1')).toBe(true);
    expect(ids.has('a2')).toBe(true);
    expect(ids.has('b')).toBe(true);
    expect(ids.has('b1')).toBe(true);
  });
});
