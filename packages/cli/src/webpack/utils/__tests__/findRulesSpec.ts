import { Configuration, RuleSetRule } from 'webpack';

import { findLoader, findRules } from '../findRules';

describe('findLoader', () => {
  describe('finding loaders in rule.use arrays', () => {
    it('should find string loader in rule.use', () => {
      const rule: RuleSetRule = {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
      };

      const result = findLoader(rule, 'babel-loader');

      expect(result).toEqual(['babel-loader']);
    });

    it('should find object loader with options in rule.use', () => {
      const rule: RuleSetRule = {
        test: /\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'style-loader',
        ],
      };

      const result = findLoader(rule, 'css-loader');

      expect(result).toEqual([
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
      ]);
    });

    it('should find multiple matching loaders in rule.use', () => {
      const rule: RuleSetRule = {
        test: /\.ts$/,
        use: ['ts-loader', 'babel-loader', 'ts-loader'],
      };

      const result = findLoader(rule, 'ts-loader');

      expect(result).toEqual(['ts-loader', 'ts-loader']);
    });

    it('should return null when loader not found in rule.use', () => {
      const rule: RuleSetRule = {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
      };

      const result = findLoader(rule, 'css-loader');

      expect(result).toBeNull();
    });
  });

  describe('finding loaders in rule.loader', () => {
    it('should find loader in rule.loader property', () => {
      const rule: RuleSetRule = {
        test: /\.js$/,
        loader: 'babel-loader',
      };

      const result = findLoader(rule, 'babel-loader');

      expect(result).toEqual(['babel-loader']);
    });

    it('should return null when loader not found in rule.loader', () => {
      const rule: RuleSetRule = {
        test: /\.js$/,
        loader: 'babel-loader',
      };

      const result = findLoader(rule, 'css-loader');

      expect(result).toBeNull();
    });
  });

  describe('finding loaders in rule.oneOf', () => {
    it('should find loader in oneOf rules', () => {
      const rule: RuleSetRule = {
        oneOf: [
          {
            test: /\.css$/,
            use: [
              {
                loader: 'css-loader',
                options: { modules: true },
              },
            ],
          },
          {
            test: /\.scss$/,
            use: ['sass-loader'],
          },
        ],
      };

      const result = findLoader(rule, 'css-loader');

      expect(result).toEqual([
        {
          loader: 'css-loader',
          options: { modules: true },
        },
      ]);
    });

    it('should find loaders in nested oneOf rules', () => {
      const rule: RuleSetRule = {
        oneOf: [
          {
            test: /\.css$/,
            use: ['css-loader'],
          },
          {
            oneOf: [
              {
                test: /\.scss$/,
                use: [
                  {
                    loader: 'sass-loader',
                    options: { sourceMap: true },
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = findLoader(rule, 'sass-loader');

      expect(result).toEqual([
        {
          loader: 'sass-loader',
          options: { sourceMap: true },
        },
      ]);
    });

    it('should find multiple loaders across oneOf rules', () => {
      const rule: RuleSetRule = {
        oneOf: [
          {
            test: /\.css$/,
            use: ['css-loader'],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'css-loader',
                options: { modules: true },
              },
            ],
          },
        ],
      };

      const result = findLoader(rule, 'css-loader');

      expect(result).toEqual([
        'css-loader',
        {
          loader: 'css-loader',
          options: { modules: true },
        },
      ]);
    });
  });

  describe('finding loaders in arrays of rules', () => {
    it('should find loader in array of rules', () => {
      const rules: RuleSetRule[] = [
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['css-loader'],
        },
      ];

      const result = findLoader(rules, 'css-loader');

      expect(result).toEqual(['css-loader']);
    });

    it('should find loaders from multiple rules in array', () => {
      const rules: RuleSetRule[] = [
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: { presets: ['@babel/preset-typescript'] },
            },
          ],
        },
      ];

      const result = findLoader(rules, 'babel-loader');

      expect(result).toEqual([
        'babel-loader',
        {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-typescript'] },
        },
      ]);
    });

    it('should return null when loader not found in any rule', () => {
      const rules: RuleSetRule[] = [
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['css-loader'],
        },
      ];

      const result = findLoader(rules, 'sass-loader');

      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle rule without use, loader, or oneOf', () => {
      const rule: RuleSetRule = {
        test: /\.js$/,
      };

      const result = findLoader(rule, 'babel-loader');

      expect(result).toBeNull();
    });

    it('should handle empty use array', () => {
      const rule: RuleSetRule = {
        test: /\.js$/,
        use: [],
      };

      const result = findLoader(rule, 'babel-loader');

      expect(result).toBeNull();
    });

    it('should handle empty oneOf array', () => {
      const rule: RuleSetRule = {
        oneOf: [],
      };

      const result = findLoader(rule, 'babel-loader');

      expect(result).toBeNull();
    });

    it('should handle empty rule array', () => {
      const rules: RuleSetRule[] = [];

      const result = findLoader(rules, 'babel-loader');

      expect(result).toBeNull();
    });

    it('should match loader names partially', () => {
      const rule: RuleSetRule = {
        test: /\.js$/,
        use: ['babel-loader'],
      };

      const result = findLoader(rule, 'babel');

      expect(result).toEqual(['babel-loader']);
    });
  });
});

describe('findRules', () => {
  describe('finding rules by test string', () => {
    it('should find rule matching test regex', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
            {
              test: /\.css$/,
              use: ['css-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', undefined);

      expect(result).toHaveLength(1);
      expect((result[0] as RuleSetRule).test).toEqual(/\.js$/);
    });

    it('should find rule matching test string', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: '.js',
              use: ['babel-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', undefined);

      expect(result).toHaveLength(1);
      expect((result[0] as RuleSetRule).test).toBe('.js');
    });

    it('should find rule matching test function', () => {
      const testFn = (filename: string) => filename.endsWith('.ts');
      const config: Configuration = {
        module: {
          rules: [
            {
              test: testFn,
              use: ['ts-loader'],
            },
          ],
        },
      };

      const result = findRules(config, 'file.ts', undefined);

      expect(result).toHaveLength(1);
    });

    it('should find multiple matching rules', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
            {
              test: /\.js$/,
              use: ['eslint-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', undefined);

      expect(result).toHaveLength(2);
    });

    it('should not find rules that do not match', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ['css-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', undefined);

      expect(result).toHaveLength(0);
    });
  });

  describe('finding rules with loader parameter', () => {
    it('should find loader objects matching test and loader', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: { presets: ['@babel/preset-env'] },
                },
              ],
            },
          ],
        },
      };

      const result = findRules(config, '.js', 'babel-loader');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-env'] },
      });
    });

    it('should find string loader matching test and loader', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', 'babel-loader');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('babel-loader');
    });

    it('should find loaders from multiple matching rules', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
            {
              test: /\.js$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: { sourceMap: true },
                },
              ],
            },
          ],
        },
      };

      const result = findRules(config, '.js', 'babel-loader');

      expect(result).toHaveLength(2);
      expect(result[0]).toBe('babel-loader');
      expect(result[1]).toEqual({
        loader: 'babel-loader',
        options: { sourceMap: true },
      });
    });

    it('should return empty array when loader not found', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', 'css-loader');

      expect(result).toEqual([]);
    });

    it('should return empty array when no rules match test', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ['css-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', 'babel-loader');

      expect(result).toEqual([]);
    });
  });

  describe('finding rules in oneOf', () => {
    it('should find rules in oneOf', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              oneOf: [
                {
                  test: /\.css$/,
                  use: ['css-loader'],
                },
                {
                  test: /\.scss$/,
                  use: ['sass-loader'],
                },
              ],
            },
          ],
        },
      };

      const result = findRules(config, '.css', undefined);

      expect(result).toHaveLength(1);
      expect((result[0] as RuleSetRule).test).toEqual(/\.css$/);
    });

    it('should find loader in oneOf rules', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              oneOf: [
                {
                  test: /\.css$/,
                  use: [
                    {
                      loader: 'css-loader',
                      options: { modules: true },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const result = findRules(config, '.css', 'css-loader');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        loader: 'css-loader',
        options: { modules: true },
      });
    });

    it('should find nested oneOf rules', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              oneOf: [
                {
                  test: /\.css$/,
                  use: ['css-loader'],
                },
                {
                  oneOf: [
                    {
                      test: /\.scss$/,
                      use: [
                        {
                          loader: 'sass-loader',
                          options: { sourceMap: true },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const result = findRules(config, '.scss', 'sass-loader');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        loader: 'sass-loader',
        options: { sourceMap: true },
      });
    });
  });

  describe('edge cases', () => {
    it('should return empty array when config has no module', () => {
      const config: Configuration = {};

      const result = findRules(config, '.js', undefined);

      expect(result).toEqual([]);
    });

    it('should return empty array when config has no rules', () => {
      const config: Configuration = {
        module: {},
      };

      const result = findRules(config, '.js', undefined);

      expect(result).toEqual([]);
    });

    it('should handle rules array', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
            {
              test: /\.css$/,
              use: ['css-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', 'babel-loader');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('babel-loader');
    });

    it('should remove duplicate loaders', () => {
      const config: Configuration = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
            {
              test: /\.js$/,
              use: ['babel-loader'],
            },
          ],
        },
      };

      const result = findRules(config, '.js', 'babel-loader');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('babel-loader');
    });
  });
});
