              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Account Status</Label>
                  <div className="mt-1">
                    {selectedUser.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Disabled</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subscription</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedUser.subscriptionStatus)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <div className="mt-1">
                    {selectedUser.customClaims.admin ? (
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <ShieldCheck className="w-3 h-3" />
                        Administrator
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <User className="w-3 h-3" />
                        User
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Login</Label>
                  <p className="mt-1">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Usage Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Letters Generated</Label>
                    <p className="mt-1 text-2xl font-bold">{selectedUser.letterCount}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Profile Status</Label>
                    <div className="mt-1">
                      {selectedUser.profileCompleted ? (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          Incomplete
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserAction(
                      selectedUser.uid,
                      selectedUser.isActive ? 'disable' : 'enable'
                    )}
                    disabled={actionLoading === selectedUser.uid}
                  >
                    {selectedUser.isActive ? 'Disable Account' : 'Enable Account'}
                  </Button>
                  
                  {selectedUser.customClaims.admin ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserAction(selectedUser.uid, 'removeAdmin')}
                      disabled={actionLoading === selectedUser.uid}
                    >
                      Remove Admin Rights
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserAction(selectedUser.uid, 'makeAdmin')}
                      disabled={actionLoading === selectedUser.uid}
                    >
                      Grant Admin Rights
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
