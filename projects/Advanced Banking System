import java.util.*;
import java.util.concurrent.locks.*;

class BankAccount {
    private int accountId;
    private String ownerName;
    private double balance;
    private boolean hasLoan;
    private double loanAmount;
    private Lock lock = new ReentrantLock();

    public BankAccount(int accountId, String ownerName, double balance) {
        this.accountId = accountId;
        this.ownerName = ownerName;
        this.balance = balance;
        this.hasLoan = false;
        this.loanAmount = 0;
    }

    // Deposit money (thread-safe)
    public void deposit(double amount) {
        lock.lock();
        try {
            balance += amount;
            System.out.println(ownerName + " deposited $" + amount + ", New Balance: $" + balance);
        } finally {
            lock.unlock();
        }
    }

    // Withdraw money (thread-safe)
    public boolean withdraw(double amount) {
        lock.lock();
        try {
            if (amount <= balance) {
                balance -= amount;
                System.out.println(ownerName + " withdrew $" + amount + ", Remaining Balance: $" + balance);
                return true;
            } else {
                System.out.println(ownerName + " attempted to withdraw $" + amount + " but insufficient funds!");
                return false;
            }
        } finally {
            lock.unlock();
        }
    }

    // Transfer money to another account
    public boolean transfer(BankAccount target, double amount) {
        if (this.withdraw(amount)) {
            target.deposit(amount);
            System.out.println(ownerName + " transferred $" + amount + " to " + target.ownerName);
            return true;
        }
        return false;
    }

    // Request a loan
    public boolean requestLoan(double amount) {
        lock.lock();
        try {
            if (!hasLoan && balance >= amount * 0.1) { // simple approval: balance >= 10% of loan
                hasLoan = true;
                loanAmount = amount;
                balance += amount;
                System.out.println(ownerName + " got loan of $" + amount);
                return true;
            } else {
                System.out.println(ownerName + " loan request denied!");
                return false;
            }
        } finally {
            lock.unlock();
        }
    }

    public double getBalance() { return balance; }
    public boolean hasLoan() { return hasLoan; }
    public double getLoanAmount() { return loanAmount; }
    public String getOwnerName() { return ownerName; }
}

class Bank {
    private List<BankAccount> accounts = new ArrayList<>();

    public void addAccount(BankAccount account) {
        accounts.add(account);
    }

    // Report top 3 richest accounts
    public void topRichest() {
        accounts.sort((a, b) -> Double.compare(b.getBalance(), a.getBalance()));
        System.out.println("\nTop 3 richest accounts:");
        for (int i = 0; i < Math.min(3, accounts.size()); i++) {
            BankAccount a = accounts.get(i);
            System.out.println(a.getOwnerName() + " - Balance: $" + a.getBalance());
        }
    }

    // Report accounts with active loans
    public void activeLoans() {
        System.out.println("\nAccounts with active loans:");
        for (BankAccount a : accounts) {
            if (a.hasLoan()) {
                System.out.println(a.getOwnerName() + " - Loan Amount: $" + a.getLoanAmount());
            }
        }
    }
}

// Simulate concurrent transactions
class TransactionThread extends Thread {
    private BankAccount account;
    private BankAccount target;
    private double amount;

    public TransactionThread(BankAccount account, BankAccount target, double amount) {
        this.account = account;
        this.target = target;
        this.amount = amount;
    }

    public void run() {
        account.transfer(target, amount);
    }
}

public class AdvancedBankingSystem {
    public static void main(String[] args) throws InterruptedException {
        Bank bank = new Bank();

        BankAccount alice = new BankAccount(101, "Alice", 1000);
        BankAccount bob = new BankAccount(102, "Bob", 1500);
        BankAccount charlie = new BankAccount(103, "Charlie", 2000);

        bank.addAccount(alice);
        bank.addAccount(bob);
        bank.addAccount(charlie);

        // Concurrent transfers
        Thread t1 = new TransactionThread(alice, bob, 200);
        Thread t2 = new TransactionThread(bob, charlie, 300);
        Thread t3 = new TransactionThread(charlie, alice, 500);

        t1.start(); t2.start(); t3.start();
        t1.join(); t2.join(); t3.join();

        // Loans
        alice.requestLoan(1000);
        bob.requestLoan(500);
        charlie.requestLoan(3000);

        // Reports
        bank.topRichest();
        bank.activeLoans();
    }
}
