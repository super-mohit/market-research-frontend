// src/hooks/useAnimatedLogs.ts
import { useState, useEffect, useRef } from 'react';
import { QueryFormData } from '../types';

const getRandomItems = (arr: string[] = [], count: number, fallback: string[]): string[] => {
  if (arr.length === 0) return fallback.slice(0, count);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const LOG_TEMPLATES = (queryData?: QueryFormData) => {
  const keywords = getRandomItems(queryData?.searchTags, 3, ["sustainability", "market share", "innovations"]);
  const sources = getRandomItems(queryData?.trustedSources, 2, ["coatingsworld.com", "pcimag.com"]);

  return {
    planning: {
      duration: 20000, // 20 seconds
      logs: [
        'Analyzing research objective for key themes...',
        `Identified primary topics: ${keywords.join(', ')}`,
        `Prioritizing trusted sources: ${sources.join(', ')}`,
        'Generating 40+ strategic search vectors...',
        'Building comprehensive query strategy...',
        'Optimizing search parameters for maximum relevance...',
        '✅ Query plan finalized. Search agents deploying.',
      ],
    },
    searching: {
      duration: 30000, // 30 seconds
      logs: [
        'Deploying 9 parallel data harvesting agents...',
        `[Agent 1] Querying ${sources[0]} for "${keywords[0]}" trends...`,
        `[Agent 2] Scanning ${sources[1]} for patent filings related to "${keywords[1]}"...`,
        `[Agent 3] Cross-referencing industry reports for market projections...`,
        '[Agent 4] Mining financial databases for revenue data...',
        '[Agent 5] Analyzing competitor landscape and positioning...',
        '[Agent 6] Extracting regulatory and compliance information...',
        '[Agent 7] Gathering conference presentations and whitepapers...',
        '[Agent 8] Processing news articles and press releases...',
        '[Agent 9] Collecting patent applications and IP data...',
        'Aggregating and de-duplicating 200+ sources...',
        'Validating source credibility and recency...',
        '✅ Content harvesting complete. All agents returned.',
      ],
    },
    synthesizing: {
      duration: 30000, // 30 seconds
      logs: [
        'Initializing AI synthesis model...',
        'Processing and analyzing 35 high-relevance documents...',
        'Extracting key themes and quantitative data points...',
        'Identifying market trends and growth patterns...',
        'Analyzing competitive positioning and market share...',
        'Processing financial metrics and performance indicators...',
        'Evaluating regulatory impact and compliance requirements...',
        'Synthesizing technology trends and innovation patterns...',
        'Generating initial insights on competitive landscape...',
        'Cross-validating findings across multiple sources...',
        'Building knowledge graph of interconnected insights...',
        '✅ Comprehensive analysis complete.',
      ],
    },
    extracting: {
      duration: 20000, // 20 seconds
      logs: [
        'Deploying data extraction specialists...',
        'Extracting [News]: "Global Coatings Market to Reach $250B by 2028"...',
        `Extracting [Patent]: "New Anti-Corrosion Formulation by Competitor X"...`,
        'Extracting [Conference]: "Key Takeaways from World Coatings Summit"...',
        'Extracting [Legal]: "New EPA regulations affecting coating manufacturers"...',
        'Structuring market size and growth projections...',
        'Cataloging competitive intelligence and positioning data...',
        'Organizing regulatory and compliance information...',
        'Formatting financial performance metrics...',
        '✅ 80+ structured data points cataloged.',
      ],
    },
    compiling: {
      duration: Infinity, // Run indefinitely until API says completed
      logs: [
        'Compiling C-suite ready executive summary...',
        'Drafting "Market Opportunities" and "Strategic Threats" sections...',
        'Building competitive analysis and market positioning insights...',
        'Generating actionable recommendations and strategic priorities...',
        'Performing final validation and quality assurance checks...',
        'Uploading all artifacts to secure RAG collection...',
        'Finalizing report formatting and executive presentation...',
        'Preparing interactive dashboard and data visualizations...',
        'Optimizing for mobile and desktop viewing...',
        'Running final security and compliance scans...',
        // Note: This stage will continue running until the API returns 'completed'
      ],
    },
  };
};

export const useAnimatedLogs = (stage: string | undefined, queryData?: QueryFormData) => {
  const [logs, setLogs] = useState<string[]>(['[System] AI research agent initialized.']);
  const timeoutRef = useRef<number>();
  const logIndexRef = useRef(0);
  const currentStageRef = useRef<string>();

  useEffect(() => {
    if (!stage || stage === currentStageRef.current) {
      return;
    }

    currentStageRef.current = stage;
    logIndexRef.current = 0;
    
    const templates = LOG_TEMPLATES(queryData);
    const stageConfig = templates[stage as keyof typeof templates];
    
    if (!stageConfig) {
      setLogs(prev => [...prev, `--- Status update: ${stage.toUpperCase()} ---`]);
      return;
    }

    setLogs(prev => [...prev, '---', `Entering stage: ${stage.toUpperCase()}`, '---']);
    
    const { logs: stageLogs, duration } = stageConfig;
    
    clearInterval(timeoutRef.current);

    // For the compiling stage (infinite duration), spread logs over a longer period
    // For other stages, use the specified duration
    const effectiveDuration = duration === Infinity ? 60000 : duration; // 60 seconds for compiling stage log cycle
    const interval = effectiveDuration / (stageLogs.length || 1);

    const startLoggingForStage = () => {
      let currentIndex = 0;
      const logInterval = setInterval(() => {
        if (currentIndex < stageLogs.length) {
          setLogs(prev => [...prev, stageLogs[currentIndex]]);
          currentIndex++;
        } else if (duration === Infinity) {
          // For compiling stage, cycle through the logs or add waiting messages
          const waitingMessages = [
            'Continuing final optimizations...',
            'Performing additional quality checks...',
            'Ensuring data accuracy and completeness...',
            'Finalizing executive presentation format...',
            'Almost ready for dashboard deployment...',
          ];
          const waitingIndex = (currentIndex - stageLogs.length) % waitingMessages.length;
          setLogs(prev => [...prev, waitingMessages[waitingIndex]]);
          currentIndex++;
        } else {
          clearInterval(logInterval);
        }
      }, interval);
      timeoutRef.current = logInterval as unknown as number;
    };
    
    startLoggingForStage();

    return () => clearInterval(timeoutRef.current);
  }, [stage, queryData]);

  return logs;
};