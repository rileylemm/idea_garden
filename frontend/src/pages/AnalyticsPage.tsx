import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Target, FileText } from 'lucide-react';
import { apiService, UsageAnalytics, GrowthPatterns } from '../services/api';
import { cardStyles } from '../utils/designSystem';

export const AnalyticsPage: React.FC = () => {
  const [usageAnalytics, setUsageAnalytics] = useState<UsageAnalytics | null>(null);
  const [growthPatterns, setGrowthPatterns] = useState<GrowthPatterns | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [usage, growth] = await Promise.all([
        apiService.getUsageAnalytics(selectedPeriod),
        apiService.getGrowthPatterns()
      ]);
      setUsageAnalytics(usage);
      setGrowthPatterns(growth);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your idea garden's growth and insights</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        {usageAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`${cardStyles.base} p-6`}>
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Ideas</p>
                  <p className="text-2xl font-bold text-gray-900">{usageAnalytics.total_ideas}</p>
                </div>
              </div>
            </div>

            <div className={`${cardStyles.base} p-6`}>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ideas Created</p>
                  <p className="text-2xl font-bold text-gray-900">{usageAnalytics.ideas_created}</p>
                </div>
              </div>
            </div>

            <div className={`${cardStyles.base} p-6`}>
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{usageAnalytics.total_documents}</p>
                </div>
              </div>
            </div>

            <div className={`${cardStyles.base} p-6`}>
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Action Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{usageAnalytics.total_action_plans}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          {usageAnalytics && (
            <div className={`${cardStyles.base} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Category Distribution
              </h3>
              <div className="space-y-3">
                {usageAnalytics.categories.map((category, index) => (
                  <div key={`${category.category}-${index}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{category.category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(category.count / usageAnalytics.ideas_created) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Distribution */}
          {usageAnalytics && (
            <div className={`${cardStyles.base} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Status Distribution
              </h3>
              <div className="space-y-3">
                {usageAnalytics.statuses.map((status, index) => (
                  <div key={`${status.status}-${index}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{status.status}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${(status.count / usageAnalytics.ideas_created) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{status.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Growth Patterns */}
        {growthPatterns && (
          <div className="mt-8">
            <div className={`${cardStyles.base} p-6`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Growth Patterns
              </h3>
              
              {/* Category Growth */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Category Growth</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {growthPatterns.category_growth.map((category, index) => (
                    <div key={`${category.category}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 capitalize">{category.category}</span>
                      <span className="text-sm font-medium text-gray-900">{category.growth}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-3">Monthly Trends</h4>
                <div className="space-y-2">
                  {growthPatterns.monthly_trends.map((trend, index) => (
                    <div key={`${trend.month}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{trend.month}</span>
                      <span className="text-sm font-medium text-gray-900">{trend.ideas} ideas</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage Averages */}
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Average Time in Stages</h4>
                <div className="space-y-2">
                  {growthPatterns.stage_averages.map((stage, index) => (
                    <div key={`${stage.stage}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 capitalize">{stage.stage}</span>
                      <span className="text-sm font-medium text-gray-900">{stage.avg_days} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 