import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Plus, 
  History, 
  TrendingUp,
  TrendingDown,
  Bus,
  Train,
  MapPin,
  Clock,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function PrestoBalance() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      // Simulate Presto data
      setBalance({
        amount: 47.85,
        lastUpdated: new Date(),
        cardNumber: userData.presto_card_number || "1234 5678 9012 3456",
        status: "active",
        autoReload: true,
        autoReloadThreshold: 10.00,
        autoReloadAmount: 50.00
      });
      
      // Simulate transaction history with Toronto locations
      setTransactions([
        {
          id: 1,
          date: new Date('2024-01-15T08:30:00'),
          amount: -3.35,
          type: "fare",
          location: "Union Station",
          route: "Line 1 - Subway",
          balance: 47.85
        },
        {
          id: 2,
          date: new Date('2024-01-15T17:45:00'),
          amount: -3.35,
          type: "fare",
          location: "Bloor-Yonge Station",
          route: "Line 2 - Subway",
          balance: 44.50
        },
        {
          id: 3,
          date: new Date('2024-01-14T14:20:00'),
          amount: -3.75,
          type: "fare",
          location: "King Street West",
          route: "Route 504 - Streetcar",
          balance: 41.15
        },
        {
          id: 4,
          date: new Date('2024-01-14T09:15:00'),
          amount: 50.00,
          type: "reload",
          location: "Shoppers Drug Mart",
          route: "Auto Reload",
          balance: 44.90
        },
        {
          id: 5,
          date: new Date('2024-01-13T16:30:00'),
          amount: -3.35,
          type: "fare",
          location: "St. Patrick Station",
          route: "Line 1 - Subway",
          balance: -5.10
        }
      ]);
      
      // Calculate monthly stats
      const currentMonth = new Date().getMonth();
      const monthlyTransactions = transactions.filter(t => t.date.getMonth() === currentMonth);
      const totalSpent = monthlyTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalReloads = monthlyTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      
      setMonthlyStats({
        totalSpent,
        totalReloads,
        tripCount: monthlyTransactions.filter(t => t.type === "fare").length,
        averagePerTrip: totalSpent / monthlyTransactions.filter(t => t.type === "fare").length || 0
      });
      
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const refreshBalance = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setBalance(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
      setIsRefreshing(false);
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case "fare": return <Bus className="w-4 h-4" />;
      case "reload": return <Plus className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getBalanceStatus = (amount) => {
    if (amount < 5) return { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertTriangle };
    if (amount < 15) return { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: AlertTriangle };
    return { color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const balanceStatus = getBalanceStatus(balance?.amount || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Presto Balance</h1>
          <p className="text-lg text-gray-600">
            Track your transit spending and manage your Presto card
          </p>
        </div>

        {/* Balance Card */}
        <Card className={`border-0 shadow-lg ${balanceStatus.bg} ${balanceStatus.border} border-2`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${balanceStatus.bg} rounded-full flex items-center justify-center`}>
                  <balanceStatus.icon className={`w-6 h-6 ${balanceStatus.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Balance</p>
                  <p className="text-4xl font-bold text-gray-900">{formatCurrency(balance?.amount || 0)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={refreshBalance}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Card Number</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  •••• •••• •••• {balance?.cardNumber?.slice(-4) || '****'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Status</p>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  {balance?.status || 'Active'}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Auto Reload</p>
                <Badge className={`mt-1 ${balance?.autoReload ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {balance?.autoReload ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>

            {balance?.autoReload && (
              <div className="mt-6 p-4 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Auto Reload Settings</p>
                <p className="text-sm text-gray-900">
                  Reload {formatCurrency(balance.autoReloadAmount)} when balance drops below {formatCurrency(balance.autoReloadThreshold)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Warning */}
        {balance?.amount < 10 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Low Balance Alert:</strong> Your Presto balance is running low. Consider reloading your card to avoid issues during your next trip.
            </AlertDescription>
          </Alert>
        )}

        {/* Monthly Stats */}
        {monthlyStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">This Month Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyStats.totalSpent)}</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">This Month Reloaded</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyStats.totalReloads)}</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <Bus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.tripCount}</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Average per Trip</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyStats.averagePerTrip)}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transaction History */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {transaction.type === 'fare' ? 'Transit Fare' : 'Card Reload'}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{transaction.location}</span>
                        <span>•</span>
                        <span>{transaction.route}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{transaction.date.toLocaleDateString()}</span>
                      <span>{transaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardContent className="p-8 text-center">
              <Plus className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Reload Card</h3>
              <p className="mb-4 opacity-90">
                Add funds to your Presto card instantly
              </p>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                Reload Now
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-8 text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Manage Card</h3>
              <p className="mb-4 opacity-90">
                Update auto-reload settings and preferences
              </p>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                Card Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}