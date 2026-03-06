import { Transaction, PaginatedResponse, Alert } from '../types';
import { format, subHours, subMinutes, subDays } from 'date-fns';

// Fixed set of transaction IDs to ensure consistency between list and detail views
const FIXED_TRANSACTION_IDS = [
  "tx-20251023-001", "tx-20251023-002", "tx-20251023-003", "tx-20251023-004", "tx-20251023-005",
  "tx-20251023-006", "tx-20251023-007", "tx-20251023-008", "tx-20251023-009", "tx-20251023-010",
  "tx-20251023-011", "tx-20251023-012", "tx-20251023-013", "tx-20251023-014", "tx-20251023-015",
  "tx-20251023-016", "tx-20251023-017", "tx-20251023-018", "tx-20251023-019", "tx-20251023-020",
];

// Fixed set of alert IDs
const FIXED_ALERT_IDS = [
  "alt-20251023-001", "alt-20251023-002", "alt-20251023-003", "alt-20251023-004", "alt-20251023-005",
  "alt-20251023-006", "alt-20251023-007", "alt-20251023-008", "alt-20251023-009", "alt-20251023-010",
];

// Cache for data to ensure consistency between calls
let transactionCache: Record<string, Transaction> = {};
let alertCache: Record<string, Alert> = {};
let newTransactions: Transaction[] = [];

// Function to generate random transactions
export function generateMockTransactions(count: number = 20): Transaction[] {
  const statuses: Array<'PENDING' | 'APPROVED' | 'FLAGGED' | 'REJECTED'> = ['PENDING', 'APPROVED', 'FLAGGED', 'REJECTED'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
  const transactionTypes = ['TRANSFER', 'PAYMENT', 'WITHDRAWAL', 'DEPOSIT'];
  const userIds = ['USR001', 'USR002', 'USR003', 'USR004', 'USR005', 'USR006', 'USR007', 'USR008'];
  const countries = ['US', 'UK', 'FR', 'DE', 'CA', 'JP', 'AU', 'BR', 'IN', 'RU'];
  const cities = [
    'New York', 'London', 'Paris', 'Berlin', 'Toronto',
    'Tokyo', 'Sydney', 'Mumbai', 'Moscow', 'Los Angeles',
    'Chicago', 'Beijing', 'Bangkok', 'Dubai', 'Amsterdam'
  ];
  
  // Use cached transactions if they exist, otherwise create new ones
  return Array.from({ length: count }).map((_, index) => {
    // Use fixed ID if available, otherwise generate one
    const id = index < FIXED_TRANSACTION_IDS.length ? FIXED_TRANSACTION_IDS[index] : `tx-${Date.now()}-${index}`;
    
    // If we have this transaction cached, return it
    if (transactionCache[id]) {
      return transactionCache[id];
    }
    
    const txnId = `TXN${Math.floor(10000 + Math.random() * 90000)}`;
    const userId = userIds[Math.floor(Math.random() * userIds.length)];
    const amount = Math.floor(100 + Math.random() * 50000) / 100;
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const sourceAccount = `ACC${Math.floor(1000 + Math.random() * 9000)}`;
    const destAccount = `ACC${Math.floor(1000 + Math.random() * 9000)}`;
    const txnType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    
    // Higher risk score for flagged or rejected transactions
    let riskScore = 0;
    if (status === 'REJECTED') {
      riskScore = Math.floor(80 + Math.random() * 20);
    } else if (status === 'FLAGGED') {
      riskScore = Math.floor(60 + Math.random() * 20);
    } else if (status === 'PENDING') {
      riskScore = Math.floor(30 + Math.random() * 30);
    } else {
      riskScore = Math.floor(5 + Math.random() * 25);
    }
    
    // Create a random timestamp within the past week
    const randomOffset = Math.floor(Math.random() * 168); // Up to 7 days (168 hours)
    const createdAt = subHours(new Date(), randomOffset).toISOString();
    
    // Evaluate transactions that are not pending
    const evaluatedAt = status !== 'PENDING' ? subMinutes(new Date(createdAt), Math.floor(Math.random() * 5)).toISOString() : undefined;
    
    // Location data
    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Generate random IP and device fingerprint
    const ipSegments = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
    const ipAddress = ipSegments.join('.');
    const deviceFingerprint = `DEV${Math.floor(1000 + Math.random() * 9000)}`;
    
    const transaction = {
      id,
      transaction_id: txnId,
      user_id: userId,
      amount,
      currency,
      source_account: sourceAccount,
      dest_account: destAccount,
      transaction_type: txnType,
      ip_address: ipAddress,
      device_fingerprint: deviceFingerprint,
      location: {
        country,
        city,
        lat: Math.random() * 180 - 90,
        lon: Math.random() * 360 - 180,
      },
      status,
      risk_score: riskScore,
      evaluated_at: evaluatedAt,
      created_at: createdAt,
      updated_at: createdAt,
    };
    
    // Store in cache for future reference
    transactionCache[id] = transaction;
    
    return transaction;
  });
}

// Generate a paginated response of mock transactions
export function getMockTransactions(page: number = 0, size: number = 20, statusFilter?: string): PaginatedResponse<Transaction> {
  // Generate a large pool of transactions
  const baseTransactions = generateMockTransactions(100);
  
  // Combine with any new transactions that have been added
  const allTransactions = [...newTransactions, ...baseTransactions];
  
  // Filter by status if provided
  const filteredTransactions = statusFilter 
    ? allTransactions.filter(t => t.status === statusFilter)
    : allTransactions;
  
  // Calculate pagination
  const start = page * size;
  const end = start + size;
  const paginatedContent = filteredTransactions.slice(start, end);
  
  return {
    content: paginatedContent,
    totalElements: filteredTransactions.length,
    totalPages: Math.ceil(filteredTransactions.length / size),
    size,
    number: page,
  };
}

// Function to generate a single mock transaction with specified details
export function createMockTransaction(data: Partial<Transaction>): Transaction {
  const txnId = data.transaction_id || `TXN${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date().toISOString();
  
  return {
    id: `tx-${Date.now()}`,
    transaction_id: txnId,
    user_id: data.user_id || 'USR001',
    amount: data.amount || 100,
    currency: data.currency || 'USD',
    source_account: data.source_account || `ACC${Math.floor(1000 + Math.random() * 9000)}`,
    dest_account: data.dest_account || `ACC${Math.floor(1000 + Math.random() * 9000)}`,
    transaction_type: data.transaction_type || 'TRANSFER',
    ip_address: data.ip_address || '192.168.1.1',
    device_fingerprint: data.device_fingerprint || `DEV${Math.floor(1000 + Math.random() * 9000)}`,
    location: data.location || {
      country: 'US',
      city: 'New York',
      lat: 40.7128,
      lon: -74.0060,
    },
    status: 'PENDING',
    risk_score: 0, // Will be evaluated later
    created_at: now,
    updated_at: now,
    ...data
  };
}

// Generate recent mock dashboard data
export function getMockDashboardSummary() {
  // Count unread alerts
  const alerts = generateMockAlerts(30);
  const unreadAlerts = alerts.filter(a => a.status === 'NEW').length;
  
  return {
    totalTransactions: 1248 + newTransactions.length,
    flaggedTransactions: 87 + newTransactions.filter(t => t.status === 'FLAGGED').length,
    rejectedTransactions: 32 + newTransactions.filter(t => t.status === 'REJECTED').length,
    approvedTransactions: 1095 + newTransactions.filter(t => t.status === 'APPROVED').length,
    unreadAlerts: unreadAlerts
  };
}

// Generate time series data for the dashboard
export function getMockTimeSeriesData() {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = subHours(now, i).toISOString();
    const total = Math.floor(40 + Math.random() * 60);
    const flagged = Math.floor(total * (0.05 + Math.random() * 0.08));
    const rejected = Math.floor(total * (0.01 + Math.random() * 0.03));
    const approved = total - flagged - rejected;
    
    data.push({
      timestamp,
      total_count: total,
      flagged_count: flagged,
      rejected_count: rejected,
      approved_count: approved,
      avg_risk_score: Math.floor(20 + Math.random() * 15)
    });
  }
  
  return data;
}

// Function to generate mock alerts
export function generateMockAlerts(count: number = 10): Alert[] {
  const levels: Array<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses: Array<'NEW' | 'READ' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED'> = ['NEW', 'READ', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'];
  
  // Get some transaction IDs to link alerts to
  const mockTransactions = generateMockTransactions(20);
  
  return Array.from({ length: count }).map((_, index) => {
    // Use fixed ID if available, otherwise generate one
    const id = index < FIXED_ALERT_IDS.length ? FIXED_ALERT_IDS[index] : `alt-${Date.now()}-${index}`;
    
    // If we have this alert cached, return it
    if (alertCache[id]) {
      return alertCache[id];
    }
    
    // Link to a transaction
    const transaction = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
    const transactionId = transaction.id;
    
    // Determine level and status - weighted toward high severity and new status
    const levelRand = Math.random();
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (levelRand < 0.1) level = 'LOW';
    else if (levelRand < 0.3) level = 'MEDIUM';
    else if (levelRand < 0.7) level = 'HIGH';
    else level = 'CRITICAL';
    
    const statusRand = Math.random();
    let status: 'NEW' | 'READ' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
    if (statusRand < 0.4) status = 'NEW';
    else if (statusRand < 0.6) status = 'READ';
    else if (statusRand < 0.8) status = 'IN_PROGRESS';
    else if (statusRand < 0.95) status = 'RESOLVED';
    else status = 'DISMISSED';
    
    // Create title and message based on level and transaction
    let title = '';
    let message = '';
    
    if (level === 'CRITICAL') {
      title = `Critical Fraud Alert: Transaction ${transaction.transaction_id}`;
      message = `Transaction for ${transaction.amount} ${transaction.currency} has been flagged for suspicious activity with risk score ${transaction.risk_score}.`;
    } else if (level === 'HIGH') {
      title = `High Risk Transaction Detected: ${transaction.transaction_id}`;
      message = `User ${transaction.user_id} performed a transaction with unusual characteristics. Risk score: ${transaction.risk_score}.`;
    } else if (level === 'MEDIUM') {
      title = `Suspicious Activity: ${transaction.transaction_id}`;
      message = `Transaction from ${transaction.location?.country || 'unknown location'} requires review. Amount: ${transaction.amount} ${transaction.currency}.`;
    } else {
      title = `Low Risk Alert: ${transaction.transaction_id}`;
      message = `Transaction slightly outside normal patterns. Review recommended.`;
    }
    
    const createdAt = new Date(transaction.created_at);
    // Some alerts may have been read
    const readAt = status !== 'NEW' ? new Date(createdAt.getTime() + Math.random() * 3600000).toISOString() : undefined;
    // Some alerts may have been resolved
    const resolvedAt = status === 'RESOLVED' || status === 'DISMISSED' 
      ? new Date(createdAt.getTime() + Math.random() * 7200000).toISOString() 
      : undefined;
    
    const alert = {
      id,
      transaction_id: transactionId,
      level,
      title,
      message,
      status,
      created_at: createdAt.toISOString(),
      read_at: readAt,
      resolved_at: resolvedAt
    };
    
    // Store in cache for future reference
    alertCache[id] = alert;
    
    return alert;
  });
}

// Generate a paginated response of mock alerts
export function getMockAlerts(page: number = 0, size: number = 20, statusFilter?: string): PaginatedResponse<Alert> {
  // Generate a large pool of alerts
  const allAlerts = generateMockAlerts(30);
  
  // Filter by status if provided
  const filteredAlerts = statusFilter 
    ? allAlerts.filter(a => a.status === statusFilter)
    : allAlerts;
  
  // Calculate pagination
  const start = page * size;
  const end = start + size;
  const paginatedContent = filteredAlerts.slice(start, end);
  
  return {
    content: paginatedContent,
    totalElements: filteredAlerts.length,
    totalPages: Math.ceil(filteredAlerts.length / size),
    size,
    number: page,
  };
}

// Add a new transaction and create appropriate alerts
export function addMockTransaction(txData: any): Transaction {
  // Create the transaction
  const tx = createMockTransaction(txData);
  
  // Store it in our new transactions array
  newTransactions.push(tx);
  
  // Create alerts for high risk transactions
  if (tx.risk_score >= 50) {
    const alertLevel: 'MEDIUM' | 'HIGH' | 'CRITICAL' = 
      tx.risk_score >= 90 ? 'CRITICAL' :
      tx.risk_score >= 70 ? 'HIGH' : 'MEDIUM';
    
    const alertTitle = alertLevel === 'CRITICAL' 
      ? `Critical Risk Alert: ${tx.transaction_id}`
      : `${alertLevel} Risk Transaction: ${tx.transaction_id}`;
    
    const alertMessage = `Transaction for ${tx.amount} ${tx.currency} from user ${tx.user_id} has been flagged with risk score ${tx.risk_score}.`;
    
    const alertId = `alt-new-${Date.now()}`;
    
    const alert: Alert = {
      id: alertId,
      transaction_id: tx.id,
      level: alertLevel,
      title: alertTitle,
      message: alertMessage,
      status: 'NEW',
      created_at: new Date().toISOString()
    };
    
    // Add to alert cache
    alertCache[alertId] = alert;
  }
  
  return tx;
}