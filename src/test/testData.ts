import { TreeNode } from '../types';
import { generateId as id } from '../utils/idGenerator';

export const exampleTree: TreeNode = {
  id: id(),
  name: 'root',
  type: 'object',
  children: [
    {
      id: id(),
      name: 'project',
      type: 'object',
      children: [
        {
          id: id(),
          name: 'metadata',
          type: 'object',
          children: [
            { id: id(), name: 'name', type: 'property', value: 'Example Project' },
            { id: id(), name: 'version', type: 'property', value: '1.0.0' },
            { id: id(), name: 'description', type: 'property', value: 'A sample project demonstrating various data types' }
          ]
        },
        {
          id: id(),
          name: 'authors',
          type: 'array',
          children: [
            {
              id: id(),
              name: 'author',
              type: 'object',
              children: [
                { id: id(), name: 'name', type: 'property', value: 'John Doe' },
                { id: id(), name: 'email', type: 'property', value: 'john@example.com' },
                { id: id(), name: 'role', type: 'property', value: 'Lead Developer' }
              ]
            },
            {
              id: id(),
              name: 'author',
              type: 'object',
              children: [
                { id: id(), name: 'name', type: 'property', value: 'Jane Smith' },
                { id: id(), name: 'email', type: 'property', value: 'jane@example.com' },
                { id: id(), name: 'role', type: 'property', value: 'Developer' }
              ]
            }
          ]
        },
        {
          id: id(),
          name: 'settings',
          type: 'object',
          children: [
            { id: id(), name: 'enabled', type: 'property', value: true },
            { id: id(), name: 'maxItems', type: 'property', value: 100 },
            { id: id(), name: 'theme', type: 'property', value: 'dark' },
            {
              id: id(),
              name: 'allowedOrigins',
              type: 'array',
              children: [
                { id: id(), name: 'origin', type: 'property', value: 'https://example.com' },
                { id: id(), name: 'origin', type: 'property', value: 'https://api.example.com' }
              ]
            }
          ]
        },
        {
          id: id(),
          name: 'dependencies',
          type: 'array',
          children: [
            {
              id: id(),
              name: 'dependency',
              type: 'object',
              children: [
                { id: id(), name: 'name', type: 'property', value: 'react' },
                { id: id(), name: 'version', type: 'property', value: '^18.2.0' },
                { id: id(), name: 'type', type: 'property', value: 'production' },
                {
                  id: id(),
                  name: 'peerDependencies',
                  type: 'array',
                  children: [
                    { id: id(), name: 'peer', type: 'property', value: 'react-dom' },
                    { id: id(), name: 'peer', type: 'property', value: 'react-router' }
                  ]
                }
              ]
            },
            {
              id: id(),
              name: 'dependency',
              type: 'object',
              children: [
                { id: id(), name: 'name', type: 'property', value: 'typescript' },
                { id: id(), name: 'version', type: 'property', value: '^5.0.0' },
                { id: id(), name: 'type', type: 'property', value: 'development' }
              ]
            }
          ]
        },
        {
          id: id(),
          name: 'tags',
          type: 'array',
          children: [
            { id: id(), name: 'tag', type: 'property', value: 'javascript' },
            { id: id(), name: 'tag', type: 'property', value: 'typescript' },
            { id: id(), name: 'tag', type: 'property', value: 'react' }
          ]
        },
        { id: id(), name: 'lastUpdated', type: 'property', value: '2024-03-21T12:00:00Z' },
        {
          id: id(),
          name: 'stats',
          type: 'object',
          children: [
            { id: id(), name: 'views', type: 'property', value: 1234 },
            { id: id(), name: 'likes', type: 'property', value: 56 },
            { id: id(), name: 'comments', type: 'property', value: 7 },
            {
              id: id(),
              name: 'topContributors',
              type: 'array',
              children: [
                { id: id(), name: 'contributor', type: 'property', value: 'Alice Johnson' },
                { id: id(), name: 'contributor', type: 'property', value: 'Bob Wilson' }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export const expectedYaml = `project:
  metadata:
    name: Example Project
    version: 1.0.0
    description: A sample project demonstrating various data types
  authors:
    - name: John Doe
      email: john@example.com
      role: Lead Developer
    - name: Jane Smith
      email: jane@example.com
      role: Developer
  settings:
    enabled: true
    maxItems: 100
    theme: dark
    allowedOrigins:
      - https://example.com
      - https://api.example.com
  dependencies:
    - name: react
      version: ^18.2.0
      type: production
      peerDependencies:
        - react-dom
        - react-router
    - name: typescript
      version: ^5.0.0
      type: development
  tags:
    - javascript
    - typescript
    - react
  lastUpdated: 2024-03-21T12:00:00Z
  stats:
    views: 1234
    likes: 56
    comments: 7
    topContributors:
      - Alice Johnson
      - Bob Wilson
`;

export const expectedJson = `{
  "project": {
    "metadata": {
      "name": "Example Project",
      "version": "1.0.0",
      "description": "A sample project demonstrating various data types"
    },
    "authors": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Lead Developer"
      },
      {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "Developer"
      }
    ],
    "settings": {
      "enabled": true,
      "maxItems": 100,
      "theme": "dark",
      "allowedOrigins": [
        "https://example.com",
        "https://api.example.com"
      ]
    },
    "dependencies": [
      {
        "name": "react",
        "version": "^18.2.0",
        "type": "production",
        "peerDependencies": [
          "react-dom",
          "react-router"
        ]
      },
      {
        "name": "typescript",
        "version": "^5.0.0",
        "type": "development"
      }
    ],
    "tags": [
      "javascript",
      "typescript",
      "react"
    ],
    "lastUpdated": "2024-03-21T12:00:00Z",
    "stats": {
      "views": 1234,
      "likes": 56,
      "comments": 7,
      "topContributors": [
        "Alice Johnson",
        "Bob Wilson"
      ]
    }
  }
}`;

export const expectedXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <project>
    <metadata>
      <name>Example Project</name>
      <version>1.0.0</version>
      <description>A sample project demonstrating various data types</description>
    </metadata>
    <authors>
      <author>
        <name>John Doe</name>
        <email>john@example.com</email>
        <role>Lead Developer</role>
      </author>
      <author>
        <name>Jane Smith</name>
        <email>jane@example.com</email>
        <role>Developer</role>
      </author>
    </authors>
    <settings>
      <enabled>true</enabled>
      <maxItems>100</maxItems>
      <theme>dark</theme>
      <allowedOrigins>
        <origin>https://example.com</origin>
        <origin>https://api.example.com</origin>
      </allowedOrigins>
    </settings>
    <dependencies>
      <dependency>
        <name>react</name>
        <version>^18.2.0</version>
        <type>production</type>
        <peerDependencies>
          <peer>react-dom</peer>
          <peer>react-router</peer>
        </peerDependencies>
      </dependency>
      <dependency>
        <name>typescript</name>
        <version>^5.0.0</version>
        <type>development</type>
      </dependency>
    </dependencies>
    <tags>
      <tag>javascript</tag>
      <tag>typescript</tag>
      <tag>react</tag>
    </tags>
    <lastUpdated>2024-03-21T12:00:00Z</lastUpdated>
    <stats>
      <views>1234</views>
      <likes>56</likes>
      <comments>7</comments>
      <topContributors>
        <contributor>Alice Johnson</contributor>
        <contributor>Bob Wilson</contributor>
      </topContributors>
    </stats>
  </project>
</root>`;
