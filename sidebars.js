/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'introduction',
    {
      type: 'category',
      label: 'Installation',
      link: {
        type: 'generated-index',
      },
      items: [
        'installation/git',
        'installation/docker',
        'installation/helm',
      ],
    },
    {
      type: 'category',
      label: 'Log Ingestion',
      link: {
        type: 'generated-index',
      },
      items: [
        'log-ingestion/fluentd-fluentbit',
        'log-ingestion/vector',
        'log-ingestion/splunk-hec',
        'log-ingestion/open-telemetry',
        'log-ingestion/elastic-search',
        'log-ingestion/loki',
      ],
    },
    {
      type: 'category',
      label: 'Instrumention for Traces',
      link: {
        type: 'generated-index',
      },
      items: [
        'instrument-traces/go-app',
        'instrument-traces/java-app',
        'instrument-traces/python-app',
        'instrument-traces/dotnet-app',
        'instrument-traces/js-app',
        
      ],
    },
    'searching-logs',
    'log-query-builder',
    'dashboards',
    'saved-searches',
    'alerts',
    'minion-searches',
    'cluster-health',
    'retention',
    'contribution-guidelines',
    'community',
    {
      type: 'category',
      label: 'SPL Search Commands',
      items: [
        'spl-search-commands/eval',
      ],
    },
  ],
  
};

export default sidebars;
