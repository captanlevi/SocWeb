import torch.nn as nn

class LSTMModel(nn.Module):
    def __init__(self,hidden_dim = 32,input_dim = 4, output_dim = 28):
        super().__init__()
        self.lstm = nn.LSTM(input_size= input_dim, hidden_size= hidden_dim,num_layers= 1, batch_first= True)
        self.linear = nn.Linear(hidden_dim,output_dim)
    
    def forward(self,x):
        """
        x is (BS,seq_len,input_dim)
        outputs scores for output_dim  (BS,output_dim)
        """
        out,_ = self.lstm(x)
        return self.linear(out[:,-1,:])