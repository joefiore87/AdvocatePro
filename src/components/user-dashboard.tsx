                        <p><strong>Accommodations:</strong> {profile.accommodations?.join(', ') || 'None listed'}</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => router.push(`/dashboard/letters/generate?student=${profile.id}`)}
                        >
                          Generate Letter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => router.push(`/dashboard/students/${profile.id}`)}
                        >
                          Edit Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Letters Tab */}
          <TabsContent value="letters" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Generated Letters</h3>
              <Button onClick={() => router.push('/dashboard/letters/generate')}>
                <Plus className="h-4 w-4 mr-2" />
                Generate Letter
              </Button>
            </div>
            
            {generatedLetters.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No letters generated yet</h4>
                  <p className="text-gray-600 mb-4">
                    Create your first advocacy letter using our professional templates.
                  </p>
                  <Button onClick={() => router.push('/dashboard/letters/generate')}>
                    Generate Your First Letter
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {generatedLetters.map((letter) => (
                  <Card key={letter.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {letter.subject}
                        <Badge variant="outline">
                          {new Date(letter.generatedAt).toLocaleDateString()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Template: {letter.templateId} • Student: {letter.studentProfileId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 mb-4">
                        {letter.content.substring(0, 200)}...
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => router.push(`/dashboard/letters/${letter.id}`)}
                        >
                          View Full Letter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([letter.content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${letter.subject}.txt`;
                            a.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Letter Templates</h3>
              <p className="text-gray-600 mb-6">
                Access our complete library of professional advocacy letter templates.
              </p>
              <Button onClick={() => router.push('/templates')}>
                Browse All Templates
              </Button>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Educational Resources</h3>
              <p className="text-gray-600 mb-6">
                Learn about special education processes, rights, and advocacy strategies.
              </p>
              <Button onClick={() => router.push('/resources')}>
                Access Learning Modules
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
